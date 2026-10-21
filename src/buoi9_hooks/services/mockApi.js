/**
 * mockApi.js
 * Quản lý dữ liệu Mock API cho bài tập Buổi 9 (Hooks)
 * - Hỗ trợ cả Mock API cục bộ (localStorage) có độ trễ mạng giả lập (500ms)
 * - Hỗ trợ cả endpoint thật từ mockapi.io (nếu người dùng cấu hình)
 * - Cung cấp khả năng mô phỏng lỗi (Error State) để kiểm tra tiêu chí chấm bài
 */

const STORAGE_KEY = 'mockapi_students_data';
const SETTINGS_KEY = 'mockapi_settings';

// Dữ liệu mẫu sinh viên khởi tạo theo giáo trình PTIT
const DEFAULT_STUDENTS = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nv@ptit.edu.vn',
    major: 'CNTT',
    gpa: '3.65',
    createdAt: new Date('2026-09-01T08:00:00Z').toISOString()
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tt@ptit.edu.vn',
    major: 'ATTT',
    gpa: '3.40',
    createdAt: new Date('2026-09-02T09:30:00Z').toISOString()
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    email: 'cuong.lv@ptit.edu.vn',
    major: 'CNTT',
    gpa: '2.85',
    createdAt: new Date('2026-09-03T10:15:00Z').toISOString()
  },
  {
    id: '4',
    name: 'Hoàng Thị Dung',
    email: 'dung.ht@ptit.edu.vn',
    major: 'HTTT',
    gpa: '3.80',
    createdAt: new Date('2026-09-04T11:00:00Z').toISOString()
  },
  {
    id: '5',
    name: 'Phạm Minh Đức',
    email: 'duc.pm@ptit.edu.vn',
    major: 'KHDL',
    gpa: '3.25',
    createdAt: new Date('2026-09-05T14:20:00Z').toISOString()
  }
];

export function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STUDENTS;
  }
}

export function saveStoredStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Không thể lưu localStorage:', err);
  }
}

export function getMockSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { simulateError: false, customUrl: '' };
  } catch {
    return { simulateError: false, customUrl: '' };
  }
}

export function saveMockSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Không thể lưu cấu hình:', err);
  }
}

/**
 * Giả lập API fetch cho trường hợp dùng mockapi nội bộ
 */
export async function mockFetch(url, options = {}) {
  const settings = getMockSettings();

  // Giả lập độ trễ mạng 500ms để quan sát rõ trạng thái "Đang tải..."
  await new Promise((resolve) => setTimeout(resolve, 550));

  // Kiểm tra mô phỏng lỗi
  if (settings.simulateError) {
    throw new Error('500 Lỗi máy chủ giả lập (Simulated Server Error)');
  }

  const method = (options.method || 'GET').toUpperCase();
  const students = getStoredStudents();

  // GET: Lấy danh sách hoặc tìm kiếm
  if (method === 'GET') {
    return {
      ok: true,
      status: 200,
      json: async () => students
    };
  }

  // POST: Thêm sinh viên mới
  if (method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newStudent = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updated = [newStudent, ...students];
    saveStoredStudents(updated);
    return {
      ok: true,
      status: 201,
      json: async () => newStudent
    };
  }

  // DELETE: Xóa sinh viên
  if (method === 'DELETE') {
    // URL dạng /api/students/:id hoặc mock://students/:id
    const parts = url.split('/');
    const idToDelete = parts[parts.length - 1];
    const updated = students.filter((s) => s.id !== idToDelete);
    saveStoredStudents(updated);
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true, id: idToDelete })
    };
  }

  throw new Error(`405 Method ${method} Not Allowed`);
}
