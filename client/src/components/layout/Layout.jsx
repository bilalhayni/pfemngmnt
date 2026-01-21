import React from 'react';
import { Navbar } from '../navigation';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, pageTitle, userName, userEmail, userInitials }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout__main">
        <Header
          title={pageTitle}
          userName={userName}
          userEmail={userEmail}
          userInitials={userInitials}
        />
        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
