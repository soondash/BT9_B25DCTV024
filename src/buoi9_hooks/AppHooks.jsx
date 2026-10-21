import React, { useState } from 'react';
import useFetch from './hooks/useFetch';
import StudentFormHooks from './StudentFormHooks';
import StudentListHooks from './StudentListHooks';
import { useTheme } from './context/ThemeContext';
import {
  mockFetch,
  getMockSettings,
  saveMockSettings,
  saveStoredStudents
} from './services/mockApi';

/**
 * AppHooks
 * Toàn bộ ứng dụng Quản lý sinh viên viết bằng Function Components + React Hooks (Buổi 9)
 * - Tuyệt đối không dùng Class Component (100% Function + Hooks)
 * - Quản lý Theme sáng/tối qua ThemeContext
 * - Lấy dữ liệu qua custom hook useFetch
 * - Hỗ trợ MockAPI endpoint linh hoạt và kiểm thử trạng thái lỗi (Error State)
 */
export default function AppHooks() {
  const { theme, toggleTheme } = useTheme();

  // Cấu hình MockAPI (mặc định dùng mockapi nội bộ giả lập)
  const [apiUrl, setApiUrl] = useState(() => {
    const s = getMockSettings();
    return s.customUrl || 'mockapi://ptit-students-api/students';
  });

  const [isSimulateError, setIsSimulateError] = useState(() => {
    return getMockSettings().simulateError;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showApiConfig, setShowApiConfig] = useState(false);

  // Sử dụng custom hook useFetch để lấy dữ liệu (đủ 3 trạng thái: data, loading, error)
  const { data: students, loading, error, refetch, setData } = useFetch(apiUrl);

  // Bật/tắt mô phỏng lỗi máy chủ để kiểm tra Error State
  const handleToggleSimulateError = (e) => {
    const checked = e.target.checked;
    setIsSimulateError(checked);
    saveMockSettings({
      simulateError: checked,
      customUrl: apiUrl.startsWith('http') ? apiUrl : ''
    });
    refetch();
  };

  // Áp dụng endpoint MockAPI tùy chỉnh (nếu sinh viên có link mockapi.io thật)
  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    const input = e.target.elements.customUrlInput.value.trim();
    const finalUrl = input || 'mockapi://ptit-students-api/students';
    setApiUrl(finalUrl);
    saveMockSettings({
      simulateError: isSimulateError,
      customUrl: input
    });
  };

  // Thêm sinh viên qua MockAPI (POST)
  const handleAddStudent = async (studentData) => {
    setIsSubmitting(true);
    try {
      if (apiUrl.startsWith('http')) {
        // Gọi HTTP POST lên mockapi.io online
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });
        if (!res.ok) throw new Error('Không thể thêm sinh viên vào MockAPI online');
        const created = await res.json();
        setData((prev) => [created, ...prev]);
      } else {
        // Gọi mockFetch nội bộ
        const res = await mockFetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(studentData)
        });
        const created = await res.json();
        setData((prev) => [created, ...prev]);
      }
      return true;
    } catch (err) {
      alert(`❌ Lỗi khi thêm sinh viên: ${err.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa sinh viên qua MockAPI (DELETE)
  const handleDeleteStudent = async (id) => {
    setDeletingId(id);
    try {
      if (apiUrl.startsWith('http')) {
        const deleteEndpoint = apiUrl.endsWith('/') ? `${apiUrl}${id}` : `${apiUrl}/${id}`;
        const res = await fetch(deleteEndpoint, { method: 'DELETE' });
        if (!res.ok) throw new Error('Không thể xóa sinh viên trên MockAPI online');
      } else {
        await mockFetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      }
      // Cập nhật state sau khi xóa thành công
      setData((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(`❌ Lỗi khi xóa sinh viên: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Reset dữ liệu MockAPI về mặc định
  const handleResetMockData = () => {
    localStorage.removeItem('mockapi_students_data');
    refetch();
  };

  return (
    <div className={`hooks-section-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Khung cấu hình MockAPI & Mô phỏng lỗi khi mở rộng */}
      {showApiConfig && (
        <div className="api-config-panel" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 className="config-title" style={{ margin: 0 }}>⚙️ Cấu hình API</h4>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setShowApiConfig(false)}
            >
              ✕ Đóng
            </button>
          </div>
          <div className="config-grid">
            <form onSubmit={handleApplyCustomUrl} className="config-url-form">
              <label className="config-label">
                Đường dẫn API (URL):
              </label>
              <div className="url-input-group">
                <input
                  name="customUrlInput"
                  defaultValue={apiUrl.startsWith('http') ? apiUrl : ''}
                  placeholder="https://.../api/students"
                  className="form-input text-mono"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Lưu
                </button>
              </div>
            </form>

            <div className="config-testing-options">
              <label className="checkbox-label highlight-test">
                <input
                  type="checkbox"
                  checked={isSimulateError}
                  onChange={handleToggleSimulateError}
                />
                <span>Mô phỏng lỗi kết nối</span>
              </label>

              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={handleResetMockData}
              >
                Khôi phục dữ liệu ban đầu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid 2 cột: Form và Danh sách */}
      <div className="app-grid-layout">
        <div className="grid-column-form">
          <StudentFormHooks onAdd={handleAddStudent} isSubmitting={isSubmitting} />
        </div>

        <div className="grid-column-list">
          <StudentListHooks
            students={students}
            loading={loading}
            error={error}
            onDelete={handleDeleteStudent}
            onRetry={refetch}
            deletingId={deletingId}
            onToggleConfig={() => setShowApiConfig(!showApiConfig)}
            showApiConfig={showApiConfig}
            onRefetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}
