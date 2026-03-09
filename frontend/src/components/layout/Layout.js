import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { bg, text } = useTheme();
  return (
    <div style={{ backgroundColor: bg, color: text, minHeight: '100vh' }}>
      <Navbar />
      <main className="container-fluid py-4 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;