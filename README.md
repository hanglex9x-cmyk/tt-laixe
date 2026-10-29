# App Quản lý Trung tâm Đào tạo Lái xe — BẢN GENERIC (cho từng khách mới)

Bản sao từ hệ thống Hồng Phúc đã **gỡ toàn bộ thương hiệu cứng**. Mỗi trung tâm
tự nhập **tên + địa chỉ + SĐT + logo + màu banner** ngay trong app:

- Vào mục **Cấu hình** (menu trái / Tất cả mục) → nhập tên trung tâm, tên rút gọn,
  địa chỉ, SĐT, **tải ảnh logo** → bấm **Lưu cấu hình**.
- **Mẫu màu giao diện (template)**: 6 mẫu có sẵn — Xanh lá (mặc định), Cam năng
  động, Xanh dương, Xanh ngọc, Đỏ đô, Xám xanh — bấm là xem thử ngay, đổi cả
  banner + nút bấm + menu đang chọn; hoặc tự chọn màu riêng bằng ô chọn màu.
- Banner đầu trang, biên lai in, mẫu tin Zalo… đều tự dùng tên/logo mới.
- Logo được nén tự động (≤ ~44KB) để lưu vào Sheet.

## Cách dữ liệu cấu hình được lưu
- Backend (Code.gs) có 2 action mới: `getconfig` / `saveconfig`, lưu ở tab
  **CAU_HINH** (Khoa|GiaTri) trong Sheet của chính trung tâm → mọi thiết bị
  mở app đều thấy cùng tên + logo.
- Nếu chưa deploy backend mới, cấu hình vẫn lưu tạm trên từng thiết bị
  (localStorage) — mở mục Cấu hình sẽ thấy ghi chú này.

## Triển khai cho 1 khách mới (kiểu Sheet + Apps Script)
1. Khách tạo Google Sheet mới (hoặc Make a copy từ Sheet mẫu) → lấy Sheet ID.
2. Dán ID vào `const SHEET_ID` ở đầu `Code.gs`.
3. Tạo Apps Script project, dán `Code.gs`, deploy Web App (Execute as Me,
   Anyone) → lấy URL /exec.
4. Thay `API_URL` mặc định trong `index.html` bằng URL /exec của khách
   (hoặc mở web kèm `?api=<url>`).
5. Đẩy `index.html` lên repo GitHub riêng của khách → bật GitHub Pages.
6. Vào app → mục Cấu hình → nhập tên + logo của trung tâm → Lưu.

## File trong gói
- `index.html` — frontend (đang trỏ tạm API demo để xem thử giao diện).
- `Code.gs` — backend Apps Script (đã có sẵn getconfig/saveconfig).
- `logo-mau.png` — logo mẫu dùng thử tính năng tải logo.
