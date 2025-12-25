#!/usr/bin/env python3
"""
Script để crawl nội dung từ các trang tarot card.
Lấy dữ liệu từ div.content__body và format theo chuẩn JSON.
"""

import json
import re
import time
from pathlib import Path
from typing import Dict, List

import requests
from bs4 import BeautifulSoup


def sanitize_html(html: str) -> str:
    """
    Sanitize HTML để có thể lưu vào database dạng JSONB.
    Loại bỏ các ký tự đặc biệt có thể gây vấn đề với JSON.
    """
    # Loại bỏ các ký tự control characters (ngoại trừ \n, \r, \t)
    html = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F]', '', html)
    # Normalize whitespace
    html = re.sub(r'\s+', ' ', html)
    html = html.strip()
    return html


def should_skip_li(li_tag) -> bool:
    """
    Kiểm tra xem thẻ <li> có chứa thẻ <a> bên trong không.
    Nếu có thì bỏ qua.
    """
    return li_tag.find('a') is not None


def extract_content_blocks(soup: BeautifulSoup) -> List[Dict]:
    """
    Trích xuất các block nội dung từ div.content__body.
    
    Args:
        soup: BeautifulSoup object của trang HTML
        
    Returns:
        List các block với format: {index, type, html}
    """
    content_body = soup.find('div', class_='content__body')
    
    if not content_body:
        return []
    
    blocks = []
    index = 1
    processed_elements = set()  # Track các phần tử đã xử lý
    
    # Hàm helper để kiểm tra xem một phần tử có nằm trong phần tử đã xử lý không
    def is_processed_or_inside_processed(element):
        current = element
        while current:
            if id(current) in processed_elements:
                return True
            current = current.parent
        return False
    
    # Duyệt tất cả các phần tử con của content__body theo thứ tự
    # Sử dụng find_all với recursive=True để tìm tất cả, sau đó lọc
    all_elements = content_body.find_all(['p', 'ul', 'li', 'h1', 'h2', 'h3'], recursive=True)
    
    for element in all_elements:
        # Bỏ qua nếu đã được xử lý hoặc nằm trong phần tử đã xử lý
        if is_processed_or_inside_processed(element):
            continue
        
        tag_name = element.name
        
        # Xử lý <ul>: Loại bỏ các <li> có <a> trước khi lưu
        if tag_name == 'ul':
            # Tạo bản sao để không ảnh hưởng đến DOM gốc
            ul_copy = BeautifulSoup(str(element), 'lxml').find('ul')
            if not ul_copy:
                continue
            
            # Loại bỏ các <li> có chứa <a>
            li_items = ul_copy.find_all('li', recursive=False)
            for li in li_items:
                if should_skip_li(li):
                    li.decompose()
            
            # Chỉ lưu nếu <ul> còn ít nhất 1 <li> và có nội dung text
            remaining_lis = ul_copy.find_all('li')
            if remaining_lis and ul_copy.get_text(strip=True):
                html = str(ul_copy)
                html = sanitize_html(html)
                blocks.append({
                    'index': index,
                    'type': 'ul',
                    'html': html
                })
                index += 1
                processed_elements.add(id(element))
        
        # Xử lý <li>: Chỉ lấy các <li> độc lập (không nằm trong <ul>)
        elif tag_name == 'li':
            # Kiểm tra xem <li> này có nằm trong <ul> không
            parent = element.parent
            if parent and parent.name == 'ul':
                # <li> nằm trong <ul> sẽ được xử lý khi xử lý <ul>, bỏ qua
                continue
            
            # <li> độc lập, kiểm tra xem có chứa <a> không
            if should_skip_li(element):
                continue
            
            # Lấy HTML của <li> độc lập
            html = str(element)
            html = sanitize_html(html)
            
            if element.get_text(strip=True):
                blocks.append({
                    'index': index,
                    'type': 'li',
                    'html': html
                })
                index += 1
                processed_elements.add(id(element))
        
        # Xử lý các thẻ khác: p, h1, h2, h3
        elif tag_name in ['p', 'h1', 'h2', 'h3']:
            # Kiểm tra xem thẻ này có nằm trong <ul> hoặc <li> không
            parent = element.parent
            is_inside_list = False
            while parent and parent.name:
                if parent.name in ['ul', 'li']:
                    is_inside_list = True
                    break
                parent = parent.parent
            
            if not is_inside_list:
                # Không nằm trong list, lấy thẻ này
                html = str(element)
                html = sanitize_html(html)
                
                if element.get_text(strip=True):
                    blocks.append({
                        'index': index,
                        'type': tag_name,
                        'html': html
                    })
                    index += 1
                    processed_elements.add(id(element))
    
    return blocks


def crawl_card_content(card_url: str, card_id: int) -> Dict:
    """
    Crawl nội dung từ một URL cụ thể.
    
    Args:
        card_url: URL của trang tarot card
        card_id: ID của lá bài
        
    Returns:
        Dict chứa thông tin crawl với format:
        {
            'url': str,
            'status': str,
            'cardId': int,
            'total_blocks': int,
            'blocks': List[Dict]
        }
    """
    result = {
        'url': card_url,
        'status': 'success',
        'cardId': card_id,
        'total_blocks': 0,
        'blocks': []
    }
    
    try:
        # Thêm delay để tránh bị block
        time.sleep(1)
        
        # Fetch HTML
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(card_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Extract blocks
        blocks = extract_content_blocks(soup)
        
        result['total_blocks'] = len(blocks)
        result['blocks'] = blocks
        
        if len(blocks) == 0:
            result['status'] = 'warning'
            print(f"⚠️  Warning: Không tìm thấy nội dung cho card ID {card_id} ({card_url})")
        else:
            print(f"✅ Success: Crawl được {len(blocks)} blocks cho card ID {card_id}")
            
    except requests.exceptions.RequestException as e:
        result['status'] = 'error'
        result['error'] = str(e)
        print(f"❌ Error: Không thể crawl card ID {card_id} ({card_url}): {e}")
        
    except Exception as e:
        result['status'] = 'error'
        result['error'] = str(e)
        print(f"❌ Error: Lỗi không xác định khi crawl card ID {card_id}: {e}")
    
    return result


def main():
    """Hàm main để crawl tất cả các lá bài."""
    # Đường dẫn đến file tarot_card.json
    script_dir = Path(__file__).parent
    input_file = script_dir / 'tarot_card.json'
    output_file = script_dir / 'tarot_cards_content.json'
    
    # Đọc danh sách các lá bài
    print(f"📖 Đang đọc file {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    print(f"📋 Tìm thấy {len(cards)} lá bài cần crawl\n")
    
    # Crawl từng lá bài
    results = []
    total_cards = len(cards)
    
    for idx, card in enumerate(cards, 1):
        card_id = card['id']
        card_name = card['card_name']
        card_url = card['card_url']
        
        print(f"[{idx}/{total_cards}] Đang crawl: {card_name} (ID: {card_id})...")
        
        result = crawl_card_content(card_url, card_id)
        results.append(result)
        
        # Thêm delay nhỏ giữa các request
        if idx < total_cards:
            time.sleep(0.5)
    
    # Lưu kết quả
    print(f"\n💾 Đang lưu kết quả vào {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Thống kê
    success_count = sum(1 for r in results if r['status'] == 'success' and r['total_blocks'] > 0)
    warning_count = sum(1 for r in results if r['status'] == 'warning')
    error_count = sum(1 for r in results if r['status'] == 'error')
    
    print(f"\n📊 Thống kê:")
    print(f"   ✅ Thành công: {success_count}/{total_cards}")
    print(f"   ⚠️  Cảnh báo (không có nội dung): {warning_count}/{total_cards}")
    print(f"   ❌ Lỗi: {error_count}/{total_cards}")
    print(f"\n✨ Hoàn thành! Kết quả đã được lưu vào {output_file}")


if __name__ == '__main__':
    main()

