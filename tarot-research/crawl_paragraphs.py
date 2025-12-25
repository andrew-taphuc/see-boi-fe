#!/usr/bin/env python3
"""
Script để crawl và lấy tất cả nội dung trong các thẻ <p> từ trang tarotoo.com
"""

import requests
from bs4 import BeautifulSoup
import json

def crawl_paragraphs(url: str):
    """
    Crawl trang web và lấy tất cả nội dung trong các thẻ <p>
    
    Args:
        url: URL của trang web cần crawl
        
    Returns:
        List các dictionary chứa nội dung text và HTML của các thẻ <p>
    """
    print(f"Đang crawl: {url}")
    
    try:
        # Headers để giả lập trình duyệt
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Gửi request
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Tìm tất cả các thẻ <p>
        paragraphs = soup.find_all('p')
        
        # Lưu kết quả
        results = []
        for idx, p in enumerate(paragraphs, 1):
            text = p.get_text(strip=True)
            html = str(p)
            
            # Chỉ lấy các thẻ <p> có nội dung
            if text:
                results.append({
                    'index': idx,
                    'text': text,
                    'html': html
                })
        
        return {
            'url': url,
            'status': 'success',
            'total_paragraphs': len(results),
            'paragraphs': results
        }
        
    except Exception as e:
        print(f"❌ Lỗi khi crawl: {str(e)}")
        return {
            'url': url,
            'status': 'error',
            'error': str(e)
        }

def main():
    # URL cần crawl
    url = 'https://tarotoo.com/tarot-card-meanings/the-hermit'
    
    # Crawl dữ liệu
    result = crawl_paragraphs(url)
    
    # In kết quả ra console
    print(f"\n{'='*60}")
    print(f"Kết quả crawl:")
    print(f"{'='*60}")
    print(f"URL: {result['url']}")
    print(f"Status: {result['status']}")
    
    if result['status'] == 'success':
        print(f"Tổng số thẻ <p>: {result['total_paragraphs']}")
        print(f"\n{'='*60}")
        print("Nội dung các thẻ <p>:")
        print(f"{'='*60}\n")
        
        for para in result['paragraphs']:
            print(f"[{para['index']}] {para['text']}")
            print("-" * 60)
        
        # Lưu vào file JSON
        output_file = 'the_hermit_paragraphs.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Đã lưu kết quả vào file: {output_file}")
        
        # Lưu chỉ text vào file txt để dễ đọc
        output_txt = 'the_hermit_paragraphs.txt'
        with open(output_txt, 'w', encoding='utf-8') as f:
            f.write(f"URL: {url}\n")
            f.write(f"Tổng số thẻ <p>: {result['total_paragraphs']}\n")
            f.write("=" * 60 + "\n\n")
            for para in result['paragraphs']:
                f.write(f"[{para['index']}]\n")
                f.write(f"{para['text']}\n")
                f.write("-" * 60 + "\n\n")
        
        print(f"✅ Đã lưu text vào file: {output_txt}")
    else:
        print(f"❌ Lỗi: {result.get('error', 'Unknown error')}")

if __name__ == '__main__':
    main()

