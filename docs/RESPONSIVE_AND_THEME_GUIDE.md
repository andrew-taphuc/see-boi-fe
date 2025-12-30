# Hướng Dẫn Sử Dụng Mobile Responsive và Dark/Light Mode

## 📱 Mobile Responsive Layout

### 1. Breakpoints của TailwindCSS

TailwindCSS sử dụng mobile-first approach với các breakpoints sau:

| Breakpoint | Kích thước | Mô tả |
|------------|------------|-------|
| `sm:` | 640px trở lên | Small devices (tablets) |
| `md:` | 768px trở lên | Medium devices (laptops) |
| `lg:` | 1024px trở lên | Large devices (desktops) |
| `xl:` | 1280px trở lên | Extra large devices |
| `2xl:` | 1536px trở lên | 2X large devices |

### 2. Cách Sử Dụng Responsive Classes

#### Ví dụ cơ bản - Mobile First:

```jsx
// Mặc định (mobile): full width
// Tablet trở lên: 1/2 width
// Desktop trở lên: 1/3 width
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>
```

#### Ví dụ Grid Layout:

```jsx
// Mobile: 1 cột
// Tablet: 2 cột
// Desktop: 3 cột
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Ví dụ Flexbox Responsive:

```jsx
// Mobile: column (dọc)
// Tablet trở lên: row (ngang)
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Ví dụ Padding/Margin Responsive:

```jsx
// Mobile: padding nhỏ
// Tablet: padding vừa
// Desktop: padding lớn
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

#### Ví dụ Text Size Responsive:

```jsx
// Mobile: text nhỏ
// Tablet: text vừa
// Desktop: text lớn
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Title
</h1>
```

### 3. Best Practices

1. **Luôn bắt đầu với mobile design** (mobile-first)
2. **Sử dụng container mx-auto** để căn giữa nội dung:
   ```jsx
   <div className="container mx-auto px-4">
     Content
   </div>
   ```
3. **Sử dụng gap thay vì margin** cho spacing:
   ```jsx
   <div className="flex gap-4 md:gap-6 lg:gap-8">
   ```
4. **Ẩn/hiện elements theo breakpoint**:
   ```jsx
   {/* Chỉ hiện trên desktop */}
   <div className="hidden lg:block">Desktop only</div>
   
   {/* Chỉ hiện trên mobile */}
   <div className="block lg:hidden">Mobile only</div>
   ```

---

## 🌓 Dark/Light Mode

### 1. Cách Sử Dụng Dark Mode Classes

#### Ví dụ cơ bản:

```jsx
// Tự động thay đổi màu theo theme
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

#### Ví dụ với nhiều thuộc tính:

```jsx
<div className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-white
  border border-gray-200 dark:border-gray-700
  shadow-lg dark:shadow-gray-900/50
">
  Content
</div>
```

### 2. Sử Dụng Theme Context

#### Lấy theme hiện tại:

```jsx
import { useTheme } from '../context/ThemeContext'

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

#### Sử dụng ThemeToggle Component:

```jsx
import ThemeToggle from '../components/ThemeToggle'

const MyComponent = () => {
  return (
    <div>
      <ThemeToggle />
    </div>
  )
}
```

### 3. Color Palette cho Dark Mode

#### Background Colors:

```jsx
// Light backgrounds
bg-white          // White
bg-gray-50        // Very light gray
bg-gray-100       // Light gray

// Dark backgrounds
dark:bg-gray-900  // Very dark gray
dark:bg-gray-800  // Dark gray
dark:bg-gray-700  // Medium dark gray
```

#### Text Colors:

```jsx
// Light text
text-gray-900     // Almost black
text-gray-800     // Dark gray
text-gray-700     // Medium gray

// Dark text
dark:text-white   // White
dark:text-gray-100 // Very light gray
dark:text-gray-200 // Light gray
```

#### Border Colors:

```jsx
border-gray-200           // Light border
dark:border-gray-700      // Dark border
dark:border-gray-600      // Medium dark border
```

### 4. Ví Dụ Component Hoàn Chỉnh

```jsx
import { useTheme } from '../context/ThemeContext'

const Card = ({ title, content }) => {
  const { theme } = useTheme()
  
  return (
    <div className="
      bg-white dark:bg-gray-800
      rounded-lg shadow-md dark:shadow-gray-900/50
      p-6
      border border-gray-200 dark:border-gray-700
      transition-colors duration-200
    ">
      <h2 className="
        text-2xl font-bold
        text-gray-900 dark:text-white
        mb-4
      ">
        {title}
      </h2>
      <p className="
        text-gray-700 dark:text-gray-300
      ">
        {content}
      </p>
    </div>
  )
}
```

### 5. Best Practices

1. **Luôn thêm transition-colors** để chuyển đổi mượt:
   ```jsx
   className="transition-colors duration-200"
   ```

2. **Sử dụng màu tương phản phù hợp**:
   - Light mode: text đen trên nền trắng
   - Dark mode: text trắng trên nền tối

3. **Test cả 2 theme** khi phát triển

4. **Sử dụng opacity cho shadows trong dark mode**:
   ```jsx
   shadow-lg dark:shadow-gray-900/50
   ```

---

## 🎨 Ví Dụ Kết Hợp Responsive + Dark Mode

```jsx
const ResponsiveCard = () => {
  return (
    <div className="
      // Responsive
      w-full
      md:w-1/2
      lg:w-1/3
      p-4 md:p-6 lg:p-8
      
      // Dark mode
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
      
      // Common
      rounded-lg
      shadow-md dark:shadow-gray-900/50
      transition-all duration-200
    ">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
        Title
      </h2>
      <p className="text-sm md:text-base lg:text-lg">
        Content that adapts to screen size and theme
      </p>
    </div>
  )
}
```

---

## 📝 Checklist Khi Phát Triển

### Mobile Responsive:
- [ ] Test trên mobile (< 640px)
- [ ] Test trên tablet (640px - 1024px)
- [ ] Test trên desktop (> 1024px)
- [ ] Kiểm tra text không quá nhỏ trên mobile
- [ ] Kiểm tra buttons/touch targets đủ lớn (min 44x44px)
- [ ] Kiểm tra spacing phù hợp trên mọi màn hình

### Dark/Light Mode:
- [ ] Mọi component đều có dark mode variant
- [ ] Text có độ tương phản đủ
- [ ] Thêm transition-colors cho smooth transition
- [ ] Test toggle theme hoạt động đúng
- [ ] Theme được lưu vào localStorage
- [ ] Kiểm tra màu sắc không bị "chói mắt" trong dark mode

---

## 🔧 Troubleshooting

### Dark mode không hoạt động?
- Kiểm tra `tailwind.config.js` có `darkMode: 'class'`
- Kiểm tra `ThemeProvider` đã wrap App chưa
- Kiểm tra class `dark` đã được thêm vào `<html>` chưa

### Responsive không hoạt động?
- Kiểm tra viewport meta tag trong `index.html`
- Kiểm tra breakpoint classes đúng cú pháp
- Test trên browser DevTools với responsive mode

### Theme không lưu?
- Kiểm tra localStorage có được enable không
- Kiểm tra `ThemeContext` có lưu vào localStorage chưa

---

## 📚 Tài Liệu Tham Khảo

- [TailwindCSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [TailwindCSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [TailwindCSS Breakpoints](https://tailwindcss.com/docs/responsive-design#breakpoints)

