import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ThemeContext (Buổi 9 - slide 32)
 * Cung cấp theme sáng/tối toàn ứng dụng không cần truyền props (tránh prop drilling)
 */
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  // Khởi tạo theme từ localStorage nếu có, mặc định là 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Đồng bộ theme vào localStorage và gán attribute data-theme cho document element
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook tiện ích để dùng ThemeContext nhanh hơn
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
}
