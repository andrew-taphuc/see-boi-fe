# Phân tích logic hiệu ứng trải bài trong yn.js

## Tổng quan

File `yn.js` chứa toàn bộ thư viện `TarotLib` với các class chính:
- `DeckManager`: Quản lý bộ bài
- `DragService`: Xử lý kéo thả và xoay container (LOGIC TRẢI BÀI CHÍNH)
- `ParticlesService`: Hiệu ứng particles
- `TarotService`: Xử lý click và flip card

## 1. LOGIC TRẢI BÀI - DragService Class

### 1.1. Khởi tạo và cấu hình

```253:314:yn.js
class DragService {
    constructor(e, t, n) {
        this.eventManager = e,
        this.elements = t,
        this.isDragging = !1,
        this.animationId = null,
        this.leftCardsHidden = !1,
        this.rightCardsHidden = !1,
        this.showedPosition = 0,
        this.currentPosition = 0,
        this.fps = new StringFPS,
        this.stopTimeout = null,
        this.shiftPosition = 0,
        this.setOption = 0,
        this.dragLengthBasic = 360 - 360 / this.elements.dragJarItems.length - this.elements.dragJarItems.length * 2,
        this.dragLength = this.dragLengthBasic * 3.5,
        // ...
    }
}
```

**Giải thích:**
- `dragLengthBasic`: Tính toán độ dài cơ bản dựa trên số lượng cards
- `dragLength`: Độ dài thực tế = `dragLengthBasic * 3.5`
- `shiftPosition`: Vị trí xoay ban đầu = -360 độ
- `showedPosition`: Vị trí hiển thị hiện tại
- `currentTranslate`: Vị trí translate hiện tại khi kéo

### 1.2. Animation loop với StringFPS

```307:313:yn.js
this.fps.setOnFrame( () => {
    this.showedPosition += this.lerp(this.showedPosition, this.currentTranslate / 4, .25),
    this.rotateContainer && (this.rotateContainer.style.transform = `rotate(${this.shiftPosition + this.showedPosition}deg)`)
}
),
this.fps.start(60),
this.isAnimatingRotate = !0
```

**Giải thích:**
- Sử dụng `lerp` (linear interpolation) để tạo hiệu ứng mượt mà
- `lerp(current, target, 0.25)`: Từ vị trí hiện tại đến vị trí đích với tốc độ 25%
- Xoay container: `rotate(${this.shiftPosition + this.showedPosition}deg)`
- FPS: 60 frames/giây

### 1.3. Hàm lerp (Linear Interpolation)

```318:320:yn.js
lerp(e, t, n) {
    return (t - e) * n
}
```

**Công thức:** `(target - current) * speed`
- Tạo hiệu ứng mượt mà khi di chuyển từ vị trí này sang vị trí khác

### 1.4. Xử lý kéo thả trên Mobile

```321:394:yn.js
initDragEvents() {
    if (isMobile() == !0) {
        // Xử lý pointer events
        const e = s => {
            // Khi thả tay
            if (this.isDragging = !1,
            this.setOption == 0 && (
                // Giới hạn trong khoảng -dragLength/2 đến dragLength/2
                this.currentTranslate >= -this.dragLength / 2 && 
                this.currentTranslate <= this.dragLength / 2 && 
                (this.prevTranslate = this.currentTranslate),
                // Giới hạn tối đa
                this.currentTranslate < -this.dragLength / 2 && (
                    this.prevTranslate = -this.dragLength / 2,
                    this.currentTranslate = this.prevTranslate),
                this.currentTranslate > this.dragLength / 2 && (
                    this.prevTranslate = this.dragLength / 2,
                    this.currentTranslate = this.prevTranslate)
            ),
            // ...
        }
        const t = s => {
            // Khi bắt đầu kéo
            this.startPosition = s.clientX,
            this.currentPosition = s.clientX,
            // Bắt đầu animation nếu chưa chạy
            this.isAnimatingRotate || (this.fps.start(60),
            this.isAnimatingRotate = !0),
            this.isDragging = !0
        }
        const n = s => {
            // Khi đang kéo
            if (this.currentPosition != s.clientX && (
                this.isDragging && (
                    this.currentPosition = s.clientX,
                    // Tính toán translate dựa trên khoảng cách kéo
                    this.currentPosition != this.startPosition && (
                        this.currentTranslate = this.prevTranslate + this.currentPosition - this.startPosition
                    )
                )
            ))
        }
    }
}
```

**Giải thích:**
- **pointerdown**: Bắt đầu kéo, lưu vị trí ban đầu
- **pointermove**: Tính toán `currentTranslate` dựa trên khoảng cách kéo
- **pointerup**: Giới hạn vị trí trong phạm vi cho phép

### 1.5. Cập nhật CSS variable --m-drag

```315:317:yn.js
set_slider_position() {
    this.elements.dragTrigger != null && 
    this.elements.dragTrigger.style.setProperty("--m-drag", `${this.currentTranslate / 4}`)
}
```

**Giải thích:**
- CSS variable `--m-drag` được cập nhật với giá trị `currentTranslate / 4`
- CSS sẽ sử dụng biến này để tính toán vị trí các cards

## 2. LOGIC POSITIONING - CSS Variables

### 2.1. Cấu trúc HTML

Trong `yesno.html`, mỗi card có:
```html
<div class="card-axis yes-no" style="--c-order: -10.5; --c-count: 22;">
```

**Giải thích:**
- `--c-order`: Thứ tự của card (từ -10.5 đến 10.5 cho 22 cards)
- `--c-count`: Tổng số cards (22)

### 2.2. Cách tính toán vị trí

CSS sẽ sử dụng các biến này để tính toán:
- Vị trí X: Dựa trên `--c-order` và `--c-count`
- Vị trí Y: Có thể dựa trên `--m-drag` (từ DragService)
- Transform: Kết hợp rotate và translate

## 3. LOGIC XOAY CONTAINER

### 3.1. Xoay container khi kéo

```308:310:yn.js
this.showedPosition += this.lerp(this.showedPosition, this.currentTranslate / 4, .25),
this.rotateContainer && (
    this.rotateContainer.style.transform = `rotate(${this.shiftPosition + this.showedPosition}deg)`
)
```

**Giải thích:**
- `shiftPosition`: -360 độ (vị trí ban đầu)
- `showedPosition`: Được cập nhật mượt mà bằng lerp
- Kết quả: Container xoay từ -360 độ, tạo hiệu ứng trải bài

### 3.2. Reset khi loading

```289:299:yn.js
this.eventManager.on(Events.CardLoadingPlayAudio, () => {
    this.fps.stop(),
    this.shiftPosition = -360,
    this.currentPosition = 0,
    this.startPosition = 0,
    this.currentTranslate = 0,
    this.prevTranslate = 0,
    this.showedPosition = 0,
    this.isAnimatingRotate = !1,
    this.rotateContainer && (this.rotateContainer.style.transform = "")
})
```

**Giải thích:**
- Khi bắt đầu loading, reset tất cả về giá trị ban đầu
- Dừng animation và reset transform

## 4. LOGIC KHI CHỌN CARD

### 4.1. Reset drag khi đã chọn đủ cards

```277:286:yn.js
this.eventManager.on(Events.CardSelectedResetDrag, () => {
    this.startPosition = 0,
    this.currentTranslate = 0,
    this.prevTranslate = 0,
    this.elements.dragTrigger != null && (
        this.currentTranslate = 0,
        this.elements.dragTrigger.style.setProperty("--m-drag", "0"),
        this.rotateContainer && (this.rotateContainer.style.transform = "")
    ),
    this.setOption = 1
})
```

**Giải thích:**
- Khi đã chọn đủ cards, reset drag về 0
- Đổi `setOption = 1` để giới hạn drag trong khoảng -300 đến 300

## 5. TÓM TẮT FLOW

1. **Khởi tạo:**
   - Tính `dragLength` dựa trên số lượng cards
   - Set `shiftPosition = -360`
   - Bắt đầu animation loop với FPS 60

2. **Khi người dùng kéo (mobile):**
   - `pointerdown`: Lưu vị trí ban đầu
   - `pointermove`: Tính `currentTranslate` = `prevTranslate + (currentPosition - startPosition)`
   - Animation loop: Cập nhật `showedPosition` bằng lerp
   - CSS: Xoay container = `rotate(shiftPosition + showedPosition)`

3. **CSS xử lý:**
   - Sử dụng `--m-drag` và `--c-order` để tính vị trí từng card
   - Transform: `translateX`, `translateY`, `rotate`

4. **Khi chọn đủ cards:**
   - Reset drag về 0
   - Đổi `setOption = 1` (giới hạn nhỏ hơn)

## 6. CÁC THAM SỐ QUAN TRỌNG

- `dragLengthBasic = 360 - 360 / cardCount - cardCount * 2`
- `dragLength = dragLengthBasic * 3.5`
- `shiftPosition = -360` (vị trí ban đầu)
- `lerp speed = 0.25` (tốc độ mượt mà)
- `FPS = 60` (tốc độ animation)
- `setOption = 0`: Giới hạn `-dragLength/2` đến `dragLength/2`
- `setOption = 1`: Giới hạn `-300` đến `300`

## 7. CSS VARIABLES ĐƯỢC SỬ DỤNG

- `--m-drag`: Vị trí kéo (từ DragService)
- `--c-order`: Thứ tự card (từ HTML)
- `--c-count`: Tổng số cards (từ HTML)
- `--c-choise`: Thứ tự chọn card
- `--c-move-x`, `--c-move-y`: Vị trí di chuyển khi show result

## 8. CÁCH HOẠT ĐỘNG

1. **Trải bài ban đầu:**
   - Container xoay -360 độ
   - Cards được sắp xếp theo `--c-order` trong một vòng tròn

2. **Khi kéo:**
   - Container xoay thêm dựa trên `currentTranslate`
   - Cards di chuyển theo vòng tròn
   - Tạo hiệu ứng như đang xoay bộ bài

3. **Animation mượt:**
   - Sử dụng lerp để tạo chuyển động mượt mà
   - Không có giật lag

4. **Giới hạn:**
   - Không cho kéo quá xa
   - Giữ cards trong tầm nhìn

