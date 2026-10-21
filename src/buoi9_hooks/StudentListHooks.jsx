import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

/**
 * StudentListHooks
 * Danh sách sinh viên viết bằng Function Component + Hooks (Buổi 9)
 * - useContext(ThemeContext): lấy theme và hàm toggle
 * - Xử lý đầy đủ 3 trạng thái:
 *    1. loading: Hiển thị hiệu ứng tải dữ liệu
 *    2. error: Hiển thị thông báo lỗi kèm nút Thử lại
 *    3. data: Hiển thị danh sách sinh viên
 * - Tìm kiếm có Debounce qua useEffect (slide 29 Buổi 9)
 * - Xóa có hỏi xác nhận
 */
export default function StudentListHooks({
  students = [],
  loading = false,
  error = null,
  onDelete,
  onRetry,
  deletingId = null,
  onToggleConfig,
  showApiConfig,
  onRefetch
}) {
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Áp dụng kỹ thuật Debounce bằng useEffect và cleanup function (Buổi 9 slide 29)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350); // Chờ 350ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timer); // Hủy timer nếu người dùng tiếp tục gõ
  }, [searchTerm]);

  // Lọc sinh viên theo từ khóa tìm kiếm đã debounce
  const filteredStudents = students.filter((sv) =>
    sv.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
  );

  // Xóa có xác nhận
  const handleDelete = (sv) => {
    const isConfirmed = window.confirm(
      `⚠️ XÁC NHẬN XÓA (MOCKAPI):\nBạn có chắc chắn muốn xóa sinh viên "${sv.name}" (ID: ${sv.id}) không?`
    );
    if (isConfirmed && onDelete) {
      onDelete(sv.id);
    }
  };

  const getGpaBadgeClass = (gpa) => {
    const num = parseFloat(gpa);
    if (num >= 3.6) return 'badge-gpa-excellent';
    if (num >= 3.2) return 'badge-gpa-good';
    if (num >= 2.5) return 'badge-gpa-fair';
    return 'badge-gpa-average';
  };

  const getGpaRank = (gpa) => {
    const num = parseFloat(gpa);
    if (num >= 3.6) return 'Xuất sắc';
    if (num >= 3.2) return 'Giỏi';
    if (num >= 2.5) return 'Khá';
    return 'Trung bình';
  };

  const averageGpa =
    students.length > 0
      ? (students.reduce((acc, sv) => acc + parseFloat(sv.gpa || 0), 0) / students.length).toFixed(2)
      : '0.00';

  return (
    <div className={`card list-card ${theme === 'dark' ? 'card-dark' : ''}`}>
      <div className="card-header list-header-flex">
        <div>
          <h3 className="card-title">Danh sách sinh viên</h3>
          <p className="card-subtitle">
            Tổng số: <strong>{students.length}</strong> sinh viên | GPA trung bình: <strong>{averageGpa}</strong>
            {onToggleConfig && (
              <button
                type="button"
                className="btn-inline-link"
                onClick={onToggleConfig}
                title="Cài đặt kết nối"
              >
                ⚙️ {showApiConfig ? 'Đóng cấu hình' : 'Cấu hình API'}
              </button>
            )}
            {onRefetch && (
              <button
                type="button"
                className="btn-inline-link"
                onClick={onRefetch}
                title="Tải lại dữ liệu"
              >
                🔄 Tải lại
              </button>
            )}
          </p>
        </div>

        {/* Ô tìm kiếm theo tên */}
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="hooks-search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TRẠNG THÁI 1: LOADING */}
      {loading && (
        <div className="loading-state-box">
          <div className="loading-spinner"></div>
          <h4>Đang tải danh sách sinh viên...</h4>
        </div>
      )}

      {/* TRẠNG THÁI 2: ERROR */}
      {!loading && error && (
        <div className="error-state-box">
          <div className="error-icon">⚠️</div>
          <h4>Có lỗi xảy ra khi tải dữ liệu</h4>
          <p className="error-detail">{error}</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Thử tải lại
          </button>
        </div>
      )}

      {/* TRẠNG THÁI 3: DATA (SUCCESS) */}
      {!loading && !error && (
        <>
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h4>Chưa có sinh viên</h4>
              <p>Hãy thêm sinh viên bằng form bên cạnh!</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h4>Không tìm thấy kết quả</h4>
              <p>Không có sinh viên nào khớp với từ khóa "{debouncedSearch}".</p>
            </div>
          ) : (
            <div className="student-list-wrapper">
              <ul className="student-list">
                {filteredStudents.map((sv) => {
                  const isBeingDeleted = deletingId === sv.id;
                  return (
                    <li key={sv.id} className={`student-item ${isBeingDeleted ? 'is-deleting' : ''}`}>
                      <div className="student-avatar avatar-hooks">
                        {sv.name.trim().charAt(0).toUpperCase()}
                      </div>

                      <div className="student-info">
                        <div className="student-primary-line">
                          <span className="student-name">{sv.name}</span>
                          <span className="badge badge-major">{sv.major}</span>
                          <span className={`badge ${getGpaBadgeClass(sv.gpa)}`}>
                            GPA: {sv.gpa} ({getGpaRank(sv.gpa)})
                          </span>
                        </div>

                        <div className="student-secondary-line">
                          <span className="student-email">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            {sv.email}
                          </span>
                          <span className="student-id-tag">ID: #{sv.id}</span>
                        </div>
                      </div>

                      <div className="student-actions">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(sv)}
                          disabled={isBeingDeleted}
                          id={`hooks-delete-${sv.id}`}
                        >
                          {isBeingDeleted ? (
                            <>
                              <span className="spinner-border-sm"></span>
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                              Xóa
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
