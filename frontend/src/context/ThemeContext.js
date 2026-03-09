import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    isDark,
    toggleTheme,
    bg: isDark ? '#1a1a2e' : '#f0f2f5',
    cardBg: isDark ? '#16213e' : '#ffffff',
    text: isDark ? '#e0e0e0' : '#212529',
    textMuted: isDark ? '#a0a0b0' : '#6c757d',
    border: isDark ? '#2d2d4e' : '#dee2e6',
    inputBg: isDark ? '#0f3460' : '#f8f9fa',
    navBg: isDark
      ? 'linear-gradient(135deg, #0d0d1a, #1a1a2e)'
      : 'linear-gradient(135deg, #1a237e, #283593)',
    tableBg: isDark ? '#16213e' : '#ffffff',
    tableHover: isDark ? '#1e2a4a' : '#f8f9fa',
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);