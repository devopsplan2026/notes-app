import React from 'react';

export default function NavBar({ page, onNavigate, authUser, onLogout }) {
  return (
    <header className="top-nav">
      <div className="nav-brand">📓 My Awesome Notepad</div>

      <nav className="nav-links">
        <button
          type="button"
          className={`nav-link ${page === 'home' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        {!authUser && (
          <>
            <button
              type="button"
              className={`nav-link ${page === 'login' ? 'nav-active' : ''}`}
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`nav-link ${page === 'signup' ? 'nav-active' : ''}`}
              onClick={() => onNavigate('signup')}
            >
              Sign Up
            </button>
          </>
        )}
        {authUser && (
          <button
            type="button"
            className="nav-link nav-logout"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </nav>

      <div className="nav-user">
        {authUser ? `Welcome, ${authUser.firstName}!` : 'Guest'}
      </div>
    </header>
  );
}
