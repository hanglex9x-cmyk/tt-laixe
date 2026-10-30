# HƯỚNG DẪN KẾT NỐI GOOGLE SHEET RIÊNG CỦA TRUNG TÂM

**Nguyên tắc bảo mật:** Toàn bộ dữ liệu của trung tâm (học viên, lịch học, học phí, kết quả thi…)
được lưu trên **Google Sheet riêng của trung tâm**, trong tài khoản Google của chính trung tâm.
Bên cung cấp phần mềm **không lưu dữ liệu của trung tâm trên máy chủ của mình** và không xem được
dữ liệu nếu trung tâm không chia sẻ. Không tốn phí duy trì hàng tháng — Google Sheet miễn phí.

Sheet mẫu chuẩn (đã có sẵn đủ cột + 200 học viên mẫu để xem thử):
https://docs.google.com/spreadsheets/d/1bC5ejH0_W3gmi5tBkSf6pwSiItCZbYdc2-ZAKHUu9oo/edit

---

## 3 BƯỚC KẾT NỐI (khoảng 5 phút)

**Bước 1 — Tạo Sheet của trung tâm**
Mở Sheet mẫu ở trên → menu **Tệp (File) → Tạo bản sao (Make a copy)** → lưu vào Drive của trung tâm.
Từ lúc này, Sheet là của trung tâm 100%.

**Bước 2 — Cài cầu nối Apps Script (làm 1 lần duy nhất)**
Trong Sheet vừa sao chép: **Tiện ích mở rộng (Extensions) → Apps Script** → xóa nội dung cũ,
dán toàn bộ nội dung file **Code.gs** được bàn giao kèm app → **Triển khai (Deploy) →
Triển khai mới → Ứng dụng web (Web app)**, chọn:
- Thực thi bằng tài khoản: **của tôi (tài khoản trung tâm)**
- Ai có quyền truy cập: **Bất kỳ ai (Anyone)**
→ Sao chép **link Web App** (dạng `https://script.google.com/macros/s/.../exec`).

**Bước 3 — Dán link vào app**
Mở app → mục **Cấu hình** → phần **"🔗 Kết nối Google Sheet của bạn"**:
- Ô 1: dán link Google Sheet của trung tâm (để app ghi nhớ và mở nhanh Sheet).
- Ô 2: dán **link Web App** ở Bước 2.
- Bấm **Kiểm tra kết nối** (app báo ✅ và đọc thử tổng số học viên), rồi bấm
  **Kết nối Google Sheet của bạn**. Xong — app từ giờ đọc/ghi trực tiếp trên Sheet của trung tâm.

Muốn đổi Sheet khác hoặc ngắt kết nối: vào lại mục Cấu hình → **Ngắt kết nối**.

---

## CẤU TRÚC SHEET — CÁC CỘT DỮ LIỆU CHÍNH

Sheet gồm 17 bảng (tab). Các cột anh/chị thường hỏi nằm ở:

| Thông tin cần quản lý | Nằm ở tab | Tên cột trong Sheet |
|---|---|---|
| Tên học viên (TenHV) | HocVien | **HoTen** |
| Số điện thoại (SDT) | HocVien | **SDT** |
| Mã học viên | HocVien | **MaHV** |
| Số CCCD | HocVien | **CCCD** |
| Ngày bế giảng (NgayBeGiang) | KhoaHoc | **NgayBeGiang** |
| Ngày xuống DAT (NgayXuongDAT) | KhoaHoc | **NgayBatDauDAT** |
| Ngày khai giảng | KhoaHoc | **NgayKhaiGiang** |
| Học phí khóa | KhoaHoc | **HocPhi** |
| Biển số xe (BienSoXe) | Xe / LichHoc | **BienSo** |
| Xe của giáo viên nào | Xe | **GVChuXe** |
| Số tiền đã thu (PhiThu) | ThanhToan | **SoTien** |
| Ngày thu / phương thức | ThanhToan | **Ngay / PhuongThuc** |
| Đậu hay rớt (DauRot) | KetQuaThi | **KetQua** (giá trị: Đậu / Rớt) |
| Điểm lý thuyết / sa hình / đường trường | KetQuaThi | **DiemLT / DiemSH / DiemDT** |
| Km DAT đã chạy / mục tiêu | HocVien | **KmDATDaChay / KmDATMucTieu** |
| Giờ cabin | HocVien | **GioCabin** |
| Giáo viên phụ trách | HocVien / GiaoVien | **GVChinh / HoTen** |
| Khóa học của học viên | HocVien | **MaKhoa** |
| Trung tâm liên kết | HocVien / TrungTamLienKet | **TrungTamLienKet / Ten** |

Danh sách 17 tab: KhoaHoc · HocVien · LichHoc · ThanhToan · GiamTien · GiaoVien · Xe ·
TrungTamLienKet · BoTucThueXe · TuyenSinh · DotSathach · DangKyThi · KetQuaThi · TotNghiep ·
NhatKyNhienLieu · CauHinh · LichSu.

**Lưu ý khi tự sửa Sheet bằng tay:**
- Không đổi tên tab và không đổi dòng tiêu đề (dòng 1) — app đọc dữ liệu theo tên cột.
- Ngày tháng nhập theo dạng ngày/tháng/năm (VD: 31/10/2026).
- SĐT và CCCD: nhập như văn bản (bắt đầu bằng số 0 bình thường), đừng để Sheet tự cắt số 0 đầu.
- Sửa trực tiếp trên Sheet thì app có thể mất tới ~30 phút mới hiện số mới (bộ nhớ đệm);
  sửa ngay trong app thì cập nhật tức thì.

---

## CÂU HỎI THƯỜNG GẶP

**Dữ liệu của tôi có bị bên bán phần mềm xem được không?**
Không. Sheet nằm trong tài khoản Google của trung tâm. Bên em chỉ truy cập khi anh/chị chủ động
chia sẻ quyền để hỗ trợ.

**Có tốn phí hàng tháng không?**
Không. Google Sheet + Apps Script miễn phí trong hạn mức của Google. App dùng lâu dài.

**Tôi muốn chuyển sang Sheet khác thì sao?**
Vào Cấu hình → Ngắt kết nối → kết nối link Web App của Sheet mới. Dữ liệu ở Sheet cũ vẫn nguyên.

**Lỡ xóa nhầm dữ liệu?**
Google Sheet có lịch sử phiên bản (File → Version history) khôi phục được; ngoài ra hệ thống
tự sao lưu Sheet lúc 2h sáng mỗi ngày.
