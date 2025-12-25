#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để trích xuất CSS nội bộ từ card.html cho các phần tử trong cardList.html
"""

import re
from pathlib import Path


def extract_classes_and_ids(html_content):
    """Trích xuất tất cả các class và id từ HTML sử dụng regex"""
    classes = set()
    ids = set()
    
    # Tìm tất cả các class trong HTML
    # Pattern: class="..." hoặc class='...'
    class_pattern = r'class\s*=\s*["\']([^"\']+)["\']'
    class_matches = re.findall(class_pattern, html_content, re.IGNORECASE)
    
    for class_attr in class_matches:
        # Tách các class (có thể có nhiều class trong một thuộc tính)
        class_list = class_attr.split()
        classes.update(class_list)
    
    # Tìm tất cả các id trong HTML
    # Pattern: id="..." hoặc id='...'
    id_pattern = r'id\s*=\s*["\']([^"\']+)["\']'
    id_matches = re.findall(id_pattern, html_content, re.IGNORECASE)
    ids.update(id_matches)
    
    return classes, ids


def extract_internal_css(html_content):
    """Trích xuất tất cả CSS nội bộ từ thẻ <style>"""
    css_blocks = []
    
    # Tìm tất cả các thẻ <style> (có thể có type="text/css" hoặc không)
    # Pattern: <style[^>]*>...</style>
    style_pattern = r'<style[^>]*>(.*?)</style>'
    style_matches = re.findall(style_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    for css_content in style_matches:
        if css_content.strip():
            css_blocks.append(css_content.strip())
    
    return '\n\n'.join(css_blocks)


def filter_css_for_elements(css_content, classes, ids):
    """Lọc CSS chỉ giữ lại các rule liên quan đến classes và ids được cung cấp"""
    if not css_content:
        return ""
    
    # Loại bỏ comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    filtered_rules = []
    
    # Tách CSS thành các rule riêng lẻ
    # Xử lý cả nested rules (như @media, @keyframes, etc.)
    # Tìm tất cả các selector và block của chúng
    # Pattern: selector { properties } hoặc @rule { ... }
    
    # Trước tiên, tách các @rules (media queries, keyframes, etc.)
    at_rule_pattern = r'(@[^{]+)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}'
    remaining_css = css_content
    
    # Xử lý các @rules trước
    at_rules = []
    for match in re.finditer(at_rule_pattern, css_content, re.DOTALL):
        at_rule = match.group(0)
        # Kiểm tra xem @rule có chứa CSS liên quan không
        rule_content = match.group(2)
        # Tìm các rule bên trong @rule
        inner_rules = re.findall(r'([^{]+)\{([^{}]+)\}', rule_content, re.DOTALL)
        has_relevant_content = False
        relevant_inner_rules = []
        
        for inner_selector, inner_props in inner_rules:
            if is_selector_relevant(inner_selector, classes, ids):
                has_relevant_content = True
                relevant_inner_rules.append((inner_selector, inner_props))
        
        if has_relevant_content:
            # Tái tạo @rule với chỉ các rule liên quan
            at_rule_header = match.group(1).strip()
            inner_css = '\n'.join([f"  {sel.strip()} {{\n{props.strip()}\n  }}" 
                                  for sel, props in relevant_inner_rules])
            filtered_rules.append(f"{at_rule_header} {{\n{inner_css}\n}}")
        
        # Loại bỏ @rule đã xử lý khỏi remaining_css
        remaining_css = remaining_css.replace(at_rule, '', 1)
    
    # Xử lý các rule thông thường
    rule_pattern = r'([^{]+)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}'
    
    for match in re.finditer(rule_pattern, remaining_css, re.DOTALL):
        selector = match.group(1).strip()
        properties = match.group(2).strip()
        
        # Bỏ qua nếu là phần của @rule đã xử lý
        if selector.strip().startswith('@'):
            continue
        
        if is_selector_relevant(selector, classes, ids):
            rule = f"{selector} {{\n{properties}\n}}"
            filtered_rules.append(rule)
    
    return '\n\n'.join(filtered_rules)


def is_selector_relevant(selector, classes, ids):
    """Kiểm tra xem selector có liên quan đến các class/id được cung cấp không"""
    selector = selector.strip()
    
    # Kiểm tra classes
    for cls in classes:
        # Escape các ký tự đặc biệt trong class name (nhưng giữ lại dấu gạch dưới và gạch ngang)
        # Dấu gạch dưới và gạch ngang không cần escape trong regex
        escaped_cls = re.escape(cls)
        
        # Tìm class trong selector với nhiều pattern khác nhau
        cls_patterns = [
            r'\.' + escaped_cls + r'(?:\s|,|:|{|>|~|\+|\[|$|::|\.)',  # .class với các ký tự sau
            r'\.' + escaped_cls + r'(?=\s|,|:|{|>|~|\+|\[|$|::|\.)',  # .class với lookahead
            r'\.' + escaped_cls + r'$',  # .class ở cuối
            # Tìm class trong selector phức tạp (ví dụ: .parent .child)
            r'[\.\s]' + escaped_cls + r'(?:\s|,|:|{|>|~|\+|\[|$|::|\.)',
            # Tìm class như một từ hoàn chỉnh (không phải là phần của từ khác)
            r'(?:^|[\.\s])' + escaped_cls + r'(?:$|[\s,:\{>~\+\[::\.])'
        ]
        
        for pattern in cls_patterns:
            if re.search(pattern, selector):
                return True
        
        # Kiểm tra trực tiếp nếu class xuất hiện trong selector (cho các trường hợp phức tạp)
        # Chỉ khi class không phải là substring của class khác
        if cls in selector:
            # Đảm bảo nó là một class hoàn chỉnh, không phải substring
            # Ví dụ: tìm "card-blog-item" nhưng không phải "card-blog-item-other"
            if re.search(r'[\.\s]' + re.escape(cls) + r'(?:[^a-zA-Z0-9_-]|$)', selector):
                return True
    
    # Kiểm tra ids
    for id_name in ids:
        escaped_id = re.escape(id_name)
        id_patterns = [
            r'#' + escaped_id + r'(?:\s|,|:|{|>|~|\+|\[|$|::)',
            r'#' + escaped_id + r'$',
            r'[#\s]' + escaped_id + r'(?:[^a-zA-Z0-9_-]|$)'
        ]
        
        for pattern in id_patterns:
            if re.search(pattern, selector):
                return True
    
    return False


def main():
    # Đường dẫn đến các file
    base_path = Path(__file__).parent
    card_html_path = base_path / 'card.html'
    card_list_html_path = base_path / 'cardList.html'
    output_css_path = base_path / 'extracted_css.css'
    
    print("Đang đọc file cardList.html...")
    try:
        with open(card_list_html_path, 'r', encoding='utf-8') as f:
            card_list_html = f.read()
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file {card_list_html_path}")
        return
    
    print("Đang trích xuất classes và ids từ cardList.html...")
    classes, ids = extract_classes_and_ids(card_list_html)
    
    print(f"Tìm thấy {len(classes)} classes và {len(ids)} ids:")
    print(f"Classes: {sorted(classes)}")
    if ids:
        print(f"Ids: {sorted(ids)}")
    
    print("\nĐang đọc file card.html...")
    try:
        with open(card_html_path, 'r', encoding='utf-8') as f:
            card_html = f.read()
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file {card_html_path}")
        return
    
    print("Đang trích xuất CSS nội bộ từ card.html...")
    internal_css = extract_internal_css(card_html)
    
    if not internal_css:
        print("Cảnh báo: Không tìm thấy CSS nội bộ trong thẻ <style> của file card.html")
        print("Có thể CSS được load từ file bên ngoài hoặc inline styles.")
        return
    
    print(f"Tìm thấy {len(internal_css)} ký tự CSS")
    
    print("\nĐang lọc CSS cho các phần tử trong cardList.html...")
    filtered_css = filter_css_for_elements(internal_css, classes, ids)
    
    if not filtered_css:
        print("Cảnh báo: Không tìm thấy CSS nào phù hợp với các phần tử trong cardList.html")
        print("Đang xuất toàn bộ CSS nội bộ...")
        filtered_css = internal_css
    
    print(f"\nĐang ghi CSS đã lọc vào file {output_css_path}...")
    with open(output_css_path, 'w', encoding='utf-8') as f:
        f.write(filtered_css)
    
    print(f"Hoàn thành! Đã lưu CSS vào {output_css_path}")
    print(f"Tổng số ký tự CSS đã lọc: {len(filtered_css)}")
    
    # Hiển thị một số rule đầu tiên để xem kết quả
    if filtered_css:
        lines = filtered_css.split('\n')
        preview_lines = min(20, len(lines))
        print(f"\nXem trước {preview_lines} dòng đầu tiên:")
        print('\n'.join(lines[:preview_lines]))
        if len(lines) > preview_lines:
            print("...")


if __name__ == '__main__':
    main()
