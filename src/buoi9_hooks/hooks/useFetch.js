import { useState, useEffect, useCallback } from 'react';
import { mockFetch } from '../services/mockApi';

/**
 * Custom Hook: useFetch
 * Chuẩn theo slide 33 & tiêu chí slide 41 Buổi 9:
 * - Tái sử dụng logic gọi API có state
 * - Quản lý đủ 3 trạng thái:
 *    1. loading: boolean (true khi đang tải)
 *    2. error: string | null (thông báo lỗi khi thất bại)
 *    3. data: mảng hoặc object dữ liệu
 * - effect có dependencies đúng ([url, refreshIndex])
 * - Hỗ trợ cả MockAPI online (https://...) và MockAPI offline giả lập
 */
export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Hàm kích hoạt tải lại dữ liệu khi cần
  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    // Xác định hàm fetch: dùng fetch native nếu là http(s), ngược lại dùng mockFetch
    const doFetch = async () => {
      try {
        let res;
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          res = await fetch(url);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText || 'Không thể lấy dữ liệu'}`);
          }
          const json = await res.json();
          if (!isCancelled) {
            setData(json);
          }
        } else {
          // Gọi mockFetch nội bộ
          res = await mockFetch(url);
          const json = await res.json();
          if (!isCancelled) {
            setData(json);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Lỗi không xác định khi tải dữ liệu');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    doFetch();

    // Cleanup function để tránh cập nhật state trên unmounted component
    return () => {
      isCancelled = true;
    };
  }, [url, refreshIndex]);

  return { data, loading, error, refetch, setData };
}
