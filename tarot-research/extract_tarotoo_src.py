#!/usr/bin/env python3
"""
Script để đọc file card.html và lấy danh sách tất cả các src chứa "tarotoo.com"
"""

import re
from pathlib import Path

def extract_tarotoo_src(html_file_path):
    """
    Đọc file HTML và trích xuất tất cả các giá trị src chứa "tarotoo.com"
    
    Args:
        html_file_path: Đường dẫn đến file HTML
        
    Returns:
        List các URL src chứa "tarotoo.com"
    """
    # Đọc file HTML
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    src_list = []
    
    # Pattern để tìm các thuộc tính src và data-src
    # Tìm cả src="..." và src='...' và data-src="..." và data-src='...'
    patterns = [
        r'src\s*=\s*["\']([^"\']*tarotoo\.com[^"\']*)["\']',
        r'data-src\s*=\s*["\']([^"\']*tarotoo\.com[^"\']*)["\']',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, html_content, re.IGNORECASE)
        src_list.extend(matches)
    
    # Loại bỏ trùng lặp và sắp xếp
    unique_src_list = sorted(list(set(src_list)))
    
    return unique_src_list

def main():
    # Đường dẫn đến file card.html
    html_file = Path(__file__).parent / 'card.html'
    
    if not html_file.exists():
        print(f"Lỗi: Không tìm thấy file {html_file}")
        return
    
    print(f"Đang đọc file: {html_file}")
    print("-" * 80)
    
    # Trích xuất các src
    src_list = extract_tarotoo_src(html_file)
    
    # In kết quả
    print(f"\nTìm thấy {len(src_list)} URL src chứa 'tarotoo.com':\n")
    
    for i, src in enumerate(src_list, 1):
        print(f"{i}. {src}")
    
    # Lưu vào file text
    output_file = Path(__file__).parent / 'tarotoo_src_list.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("Danh sách tất cả các src chứa 'tarotoo.com':\n")
        f.write("=" * 80 + "\n\n")
        for i, src in enumerate(src_list, 1):
            f.write(f"{i}. {src}\n")
    
    print(f"\n{'=' * 80}")
    print(f"Đã lưu danh sách vào file: {output_file}")

if __name__ == '__main__':
    main()

