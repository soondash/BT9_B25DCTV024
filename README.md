# Báo Cáo & Mã Nguồn: Quản Lý Sinh Viên (React Hooks - Buổi 9)
> **Môn học**: Phát triển ứng dụng Web Front-end với React  
> **Nội dung thực hiện**: Bài tập về nhà Buổi 9 (React Hooks, useFetch, MockAPI, ThemeContext)

---

## 📋 Danh Sách Yêu Cầu Đã Hoàn Thành (Slide 41)

- [x] **Viết lại bài Buổi 8 bằng Hooks**: Chuyển đổi 100% sang Function Components & React Hooks (`useState`, `useEffect`, `useContext`), **không còn Class Component** trong toàn bộ dự án.
- [x] **Dữ liệu lấy từ MockAPI qua Custom Hook `useFetch`**:
  - Tách logic gọi API có state thành custom hook `useFetch(url)` chuẩn quy ước React.
  - Dependency array `[url, refreshIndex]` chuẩn xác, có cleanup function chống rò rỉ bộ nhớ.
- [x] **Đủ 3 trạng thái tải dữ liệu**:
  1. **Loading**: Hiệu ứng spinner và thông báo *"Đang tải dữ liệu từ MockAPI..."*.
  2. **Error**: Cảnh báo lỗi máy chủ/mạng kèm nút **"Thử tải lại (Retry)"** (có sẵn công tắc mô phỏng lỗi để giảng viên kiểm tra).
  3. **Data (Success)**: Hiển thị danh sách sinh viên lấy từ MockAPI.
- [x] **Tích hợp MockAPI**:
  - Tích hợp dịch vụ MockAPI cục bộ (localStorage) có độ trễ 550ms để thấy rõ hiệu ứng tải dữ liệu.
  - Hỗ trợ nhập trực tiếp endpoint từ `mockapi.io` online nếu muốn kết nối API thật.
  - Hỗ trợ đầy đủ các thao tác REST: `GET` (danh sách), `POST` (thêm mới), `DELETE` (xóa).
- [x] **Thêm `ThemeContext` sáng/tối**:
  - Xây dựng `ThemeContext` và `ThemeProvider` chia sẻ theme toàn ứng dụng không qua prop drilling.
  - Nút chuyển đổi Light / Dark Mode tức thì ở thanh tiêu đề (Header).
- [x] **Tìm kiếm có Debounce**:
  - Áp dụng `useEffect` kèm `clearTimeout` với độ trễ 350ms (chuẩn slide 29) giúp tối ưu hiệu năng khi gõ tìm kiếm.
- [x] **Validate form đầy đủ**:
  - **Họ tên**: Tối thiểu 3 ký tự.
  - **Email**: Đúng định dạng regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  - **GPA**: Bắt buộc nhập, số thực từ **0.0 đến 4.0**.
  - Báo lỗi chi tiết dưới từng ô nhập.
- [x] **Xóa có hỏi xác nhận**: Sử dụng `window.confirm` hiển thị thông báo trước khi gọi API xóa sinh viên.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
bt9/
├── src/
│   ├── buoi9_hooks/
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # ThemeContext & ThemeProvider sáng/tối (slide 32)
│   │   ├── hooks/
│   │   │   └── useFetch.js           # Custom hook useFetch quản lý 3 trạng thái (slide 33)
│   │   ├── services/
│   │   │   └── mockApi.js            # Mock API service (GET, POST, DELETE, simulate error)
│   │   ├── AppHooks.jsx              # Component kết nối useFetch, Theme và MockAPI
│   │   ├── StudentFormHooks.jsx      # Form Hooks (useState) validate Họ tên, Email, GPA
│   │   └── StudentListHooks.jsx      # Danh sách Hooks có 3 trạng thái & debounce search
│   │
│   ├── components/
│   │   └── Header.jsx                # Thanh tiêu đề & nút đổi theme (ThemeContext)
│   │
│   ├── App.jsx                       # Entry chính bọc ThemeProvider
│   ├── App.css                       # Giao diện hiện đại, Dark/Light Mode, Animation
│   ├── index.css                     # Design tokens & CSS Reset
│   └── main.jsx                      # Mount React DOM
│
├── package.json
└── vite.config.js
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

```bash
# 1. Cài đặt các gói phụ thuộc (nếu chưa cài)
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Mở trên trình duyệt
http://localhost:5173/
```

---

## 🎯 Hướng Dẫn Kiểm Tra Chấm Điểm

1. **Kiểm tra 3 trạng thái tải dữ liệu**:
   - Khi vừa tải trang: Quan sát thấy trạng thái **Loading** (spinner quay 550ms).
   - Bấm link **"⚙️ Cấu hình API"** trên danh sách -> Tích chọn **"Mô phỏng lỗi mạng"**: Lập tức kích hoạt trạng thái **Error** kèm nút *"Thử tải lại (Retry)"*.
   - Bỏ tích chọn và bấm **"Thử tải lại"**: Dữ liệu tải lại thành công về trạng thái **Data**.
2. **Kiểm tra Theme sáng/tối**:
   - Bấm nút **"🌙 Chế độ Tối"** ở góc phải thanh tiêu đề: Toàn bộ giao diện chuyển sang Dark Mode và lưu vào `localStorage`. Bấm lại chuyển về Light Mode.
3. **Kiểm tra Form & Validate**:
   - Để trống bấm **"Thêm vào MockAPI"**: Báo lỗi Họ tên, Email, GPA dưới từng ô.
   - Nhập GPA < 0 hoặc > 4: Báo lỗi `GPA phải từ 0.0 đến 4.0`.
   - Nhập dữ liệu hợp lệ: Sinh viên được thêm thành công qua MockAPI.
4. **Kiểm tra Tìm kiếm & Xóa**:
   - Gõ từ khóa vào ô tìm kiếm: Tự động lọc sau 350ms (Debounce).
   - Bấm nút **"Xóa"**: Hiện hộp thoại xác nhận `window.confirm` trước khi xóa.
