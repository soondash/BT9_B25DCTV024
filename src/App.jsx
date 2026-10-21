import React from 'react';
import Header from './components/Header';
import AppHooks from './buoi9_hooks/AppHooks';
import { ThemeProvider, useTheme } from './buoi9_hooks/context/ThemeContext';
import './App.css';

function MainContent() {
  const { theme } = useTheme();

  return (
    <div className={`app-root-wrapper ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <Header />

      <main className="main-content-area">
        <AppHooks />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
