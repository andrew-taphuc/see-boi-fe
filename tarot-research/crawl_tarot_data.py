#!/usr/bin/env python3
"""
Script để crawl dữ liệu tarot từ các URL trong video_links.json
Lấy các nội dung được đánh dấu bằng "phuc" ở đầu dòng
"""

import json
import re
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import time
import os

def load_video_links(json_path: str) -> List[Dict]:
    """Đọc danh sách URLs từ file JSON"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_phuc_content(html_content: str) -> List[Dict]:
    """
    Tìm các dòng bắt đầu bằng 'phuc' (không phân biệt hoa thường)
    và lấy nội dung HTML ngay sau đó trên cùng dòng
    """
    lines = html_content.split('\n')
    phuc_contents = []
    
    for i, line in enumerate(lines):
        # Tìm dòng bắt đầu bằng "phuc" (có thể có khoảng trắng ở đầu)
        # Lấy toàn bộ nội dung sau "phuc" trên cùng dòng
        match = re.match(r'^\s*(phuc|Phuc)\s*(.*)', line, re.IGNORECASE)
        if match:
            content_after_phuc = match.group(2).strip()
            
            # Lấy nội dung HTML sau "phuc"
            if content_after_phuc:
                # Parse HTML để lấy cả text và HTML
                soup = BeautifulSoup(content_after_phuc, 'html.parser')
                text_content = soup.get_text(strip=True)
                
                phuc_contents.append({
                    'html': content_after_phuc,  # HTML gốc để tái tạo
                    'text': text_content,  # Text đã clean để dễ đọc
                    'line_number': i + 1
                })
    
    return phuc_contents

def extract_structured_content(html_content: str) -> Dict:
    """
    Trích xuất nội dung có cấu trúc từ HTML
    Lấy title, các đoạn văn, và các phần đặc biệt
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    result = {
        'title': '',
        'title_html': '',
        'description': '',
        'paragraphs': [],
        'relationships': '',
        'reversed_meaning': '',
        'yes_no_meaning': '',
        'image_url': ''
    }
    
    # Tìm title trong thẻ h1
    h1 = soup.find('h1')
    if h1:
        result['title'] = h1.get_text(strip=True)
        result['title_html'] = str(h1)
    
    # Tìm image trong thumbnail
    img = soup.find('img', class_='attachment-post-thumbnail')
    if img:
        result['image_url'] = img.get('src') or img.get('data-src', '')
    
    # Tìm description trong meta hoặc đoạn đầu tiên
    meta_desc = soup.find('meta', property='og:description')
    if meta_desc:
        result['description'] = meta_desc.get('content', '')
    
    # Tìm tất cả các đoạn văn trong content__body
    content_body = soup.find('div', class_='content__body')
    if content_body:
        paragraphs = content_body.find_all('p')
        for p in paragraphs:
            text = p.get_text(strip=True)
            html = str(p)
            
            # Kiểm tra nếu đoạn văn có chứa các từ khóa đặc biệt
            if 'relationships' in text.lower() or 'relationship' in text.lower():
                result['relationships'] = {
                    'text': text,
                    'html': html
                }
            elif 'reversed meaning' in text.lower():
                result['reversed_meaning'] = {
                    'text': text,
                    'html': html
                }
            elif 'yes / no meaning' in text.lower() or 'yes/no meaning' in text.lower():
                result['yes_no_meaning'] = {
                    'text': text,
                    'html': html
                }
            elif text and not p.find('img'):  # Các đoạn văn thông thường (bỏ qua ảnh)
                result['paragraphs'].append({
                    'text': text,
                    'html': html
                })
    
    return result

def crawl_card_data(card_url: str, card_name: str) -> Dict:
    """
    Crawl dữ liệu từ một URL cụ thể
    """
    print(f"Đang crawl: {card_name} - {card_url}")
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(card_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        html_content = response.text
        
        # Trích xuất nội dung có cấu trúc
        structured = extract_structured_content(html_content)
        
        # Trích xuất các dòng có "phuc"
        phuc_contents = extract_phuc_content(html_content)
        
        return {
            'card_name': card_name,
            'card_url': card_url,
            'status': 'success',
            'structured_content': structured,
            'phuc_marked_content': phuc_contents,
            'total_phuc_items': len(phuc_contents)
        }
        
    except Exception as e:
        print(f"  ❌ Lỗi khi crawl {card_name}: {str(e)}")
        return {
            'card_name': card_name,
            'card_url': card_url,
            'status': 'error',
            'error': str(e)
        }

def main():
    # Đường dẫn file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    video_links_path = os.path.join(script_dir, 'video_links.json')
    output_path = os.path.join(script_dir, 'tarot_cards_data.json')
    
    # Đọc danh sách URLs
    print("Đang đọc danh sách URLs...")
    cards = load_video_links(video_links_path)
    print(f"Tìm thấy {len(cards)} lá bài\n")
    
    # Crawl dữ liệu từng lá bài
    all_data = []
    total = len(cards)
    
    for idx, card in enumerate(cards, 1):
        print(f"[{idx}/{total}] ", end='')
        card_data = crawl_card_data(card['card_url'], card['card_name'])
        all_data.append(card_data)
        
        # Thêm video URLs vào kết quả
        card_data['video_mp4'] = card.get('video_mp4')
        card_data['video_webm'] = card.get('video_webm')
        
        # Delay nhỏ để tránh spam server
        if idx < total:
            time.sleep(1)
    
    # Lưu kết quả
    print(f"\nĐang lưu kết quả vào {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    # Thống kê
    success_count = sum(1 for card in all_data if card['status'] == 'success')
    error_count = total - success_count
    
    print(f"\n✅ Hoàn thành!")
    print(f"   - Thành công: {success_count}/{total}")
    print(f"   - Lỗi: {error_count}/{total}")
    print(f"   - File output: {output_path}")

if __name__ == '__main__':
    main()

