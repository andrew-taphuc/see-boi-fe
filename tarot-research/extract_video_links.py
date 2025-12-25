#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chương trình để lấy các link video từ các thẻ bài tarot trong file card.html
Dựa vào cấu trúc mẫu trong cardList.html
"""

from bs4 import BeautifulSoup
import json
import re

def extract_video_links(html_file_path):
    """
    Trích xuất các link video từ file HTML chứa các thẻ bài tarot
    
    Args:
        html_file_path: Đường dẫn đến file card.html
        
    Returns:
        List các dictionary chứa thông tin về mỗi thẻ bài và video links
    """
    # Đọc file HTML
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Parse HTML với BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Tìm tất cả các thẻ bài (card-list__item)
    card_items = soup.find_all('div', class_='card-list__item')
    
    video_data = []
    
    for card_item in card_items:
        # Tìm link của thẻ bài
        card_link = card_item.find('a', class_='card-blog-item')
        card_url = card_link.get('href', '') if card_link else ''
        
        # Tìm tên thẻ bài
        title_element = card_item.find('h5', class_='card-blog-item__title')
        if title_element:
            title_span = title_element.find('span')
            card_name = title_span.get_text(strip=True) if title_span else title_element.get_text(strip=True)
        else:
            card_name = ''
        
        # Tìm video element
        video_element = card_item.find('video', class_='card-video')
        
        if video_element:
            # Lấy link từ data-src (thuộc tính chính)
            video_mp4 = video_element.get('data-src', '')
            
            # Lấy link từ data-src-webm (nếu có)
            video_webm = video_element.get('data-src-webm', '')
            
            # Nếu không có trong data-src, thử lấy từ source tag
            if not video_mp4:
                source_mp4 = video_element.find('source', type='video/mp4')
                if source_mp4:
                    video_mp4 = source_mp4.get('src', '')
            
            if not video_webm:
                source_webm = video_element.find('source', type='video/webm')
                if source_webm:
                    video_webm = source_webm.get('src', '')
            
            # Chỉ thêm vào danh sách nếu có ít nhất một link video
            if video_mp4 or video_webm:
                video_data.append({
                    'card_name': card_name,
                    'card_url': card_url,
                    'video_mp4': video_mp4,
                    'video_webm': video_webm if video_webm else None
                })
    
    return video_data

def save_to_json(video_data, output_file='video_links.json'):
    """Lưu dữ liệu video vào file JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(video_data, f, ensure_ascii=False, indent=2)

def save_to_txt(video_data, output_file='video_links.txt'):
    """Lưu các link video vào file text (chỉ link MP4)"""
    with open(output_file, 'w', encoding='utf-8') as f:
        for item in video_data:
            if item['video_mp4']:
                f.write(f"{item['video_mp4']}\n")

def print_summary(video_data):
    """In tóm tắt kết quả"""
    print(f"\n{'='*60}")
    print(f"Tổng số thẻ bài tìm thấy: {len(video_data)}")
    print(f"{'='*60}\n")
    
    print("Danh sách các thẻ bài và link video:\n")
    for idx, item in enumerate(video_data, 1):
        print(f"{idx}. {item['card_name']}")
        print(f"   URL: {item['card_url']}")
        print(f"   Video MP4: {item['video_mp4']}")
        if item['video_webm']:
            print(f"   Video WebM: {item['video_webm']}")
        print()

def main():
    # Đường dẫn đến file card.html
    html_file = 'card.html'
    
    print(f"Đang đọc file: {html_file}")
    print("Đang trích xuất các link video từ các thẻ bài...\n")
    
    try:
        # Trích xuất video links
        video_data = extract_video_links(html_file)
        
        if not video_data:
            print("Không tìm thấy video nào trong file HTML!")
            return
        
        # In tóm tắt
        print_summary(video_data)
        
        # Lưu vào file JSON
        json_file = 'video_links.json'
        save_to_json(video_data, json_file)
        print(f"\nĐã lưu dữ liệu đầy đủ vào: {json_file}")
        
        # Lưu chỉ các link MP4 vào file text
        txt_file = 'video_links.txt'
        save_to_txt(video_data, txt_file)
        print(f"Đã lưu danh sách link MP4 vào: {txt_file}")
        
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file {html_file}")
        print("Vui lòng đảm bảo file card.html nằm trong cùng thư mục với script này.")
    except Exception as e:
        print(f"Lỗi khi xử lý: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

