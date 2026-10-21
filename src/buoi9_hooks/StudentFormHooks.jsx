import React, { useState } from 'react';

/**
 * StudentFormHooks
 * Form thêm sinh viên viết bằng Function Component + Hooks (Buổi 9)
 * - Sử dụng useState quản lý formData, errors, isSubmitting
 * - Validate: Họ tên >= 3 ký tự, Email hợp lệ, GPA từ 0 đến 4
 * - Hiển thị lỗi dưới từng ô nhập
 */
export default function StudentFormHooks({ onAdd, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: 'CNTT',
    gpa: ''
  });

  const [errors, setErrors] = useState({});

  // Xử lý thay đổi dữ liệu với useState
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Xóa lỗi của trường khi người dùng gõ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Hàm validate dữ liệu form
  const validate = () => {
    const newErrors = {};
    const { name, email, gpa } = formData;

    if (!name || name.trim().length < 3) {
      newErrors.name = 'Họ tên tối thiểu 3 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      newErrors.email = 'Email không hợp lệ (ví dụ: dung.ht@ptit.edu.vn)';
    }

    if (gpa === '' || gpa === null || gpa === undefined) {
      newErrors.gpa = 'Vui lòng nhập điểm GPA';
    } else {
      const gpaNum = parseFloat(gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
        newErrors.gpa = 'GPA phải từ 0.0 đến 4.0';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const studentPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      major: formData.major,
      gpa: parseFloat(formData.gpa).toFixed(2)
    };

    if (onAdd) {
      const success = await onAdd(studentPayload);
      if (success !== false) {
        // Reset form sau khi thêm thành công
        setFormData({
          name: '',
          email: '',
          major: 'CNTT',
          gpa: ''
        });
        setErrors({});
      }
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3 className="card-title">Thêm sinh viên</h3>
      </div>

      <form onSubmit={handleSubmit} className="student-form" noValidate>
        {/* Họ tên */}
        <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="hooks-name" className="form-label">
            Họ tên sinh viên <span className="required">*</span>
          </label>
          <input
            id="hooks-name"
            type="text"
            name="name"
            className="form-input"
            placeholder="Ví dụ: Hoàng Thị Dung"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="hooks-email" className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            id="hooks-email"
            type="email"
            name="email"
            className="form-input"
            placeholder="Ví dụ: dung.ht@ptit.edu.vn"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Chuyên ngành và GPA */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="hooks-major" className="form-label">
              Chuyên ngành <span className="required">*</span>
            </label>
            <select
              id="hooks-major"
              name="major"
              className="form-select"
              value={formData.major}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="CNTT">CNTT (Công nghệ thông tin)</option>
              <option value="ATTT">ATTT (An toàn thông tin)</option>
              <option value="DTVT">ĐTVT (Điện tử viễn thông)</option>
              <option value="HTTT">HTTT (Hệ thống thông tin)</option>
              <option value="KHDL">KHDL (Khoa học dữ liệu)</option>
            </select>
          </div>

          <div className={`form-group flex-1 ${errors.gpa ? 'has-error' : ''}`}>
            <label htmlFor="hooks-gpa" className="form-label">
              Điểm GPA (0 - 4) <span className="required">*</span>
            </label>
            <input
              id="hooks-gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              name="gpa"
              className="form-input"
              placeholder="Ví dụ: 3.80"
              value={formData.gpa}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.gpa && <p className="error-message">{errors.gpa}</p>}
          </div>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
          id="hooks-submit-btn"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border-sm"></span>
              Đang lưu...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Thêm sinh viên
            </>
          )}
        </button>
      </form>
    </div>
  );
}
