import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import AuthForm from './components/AuthForm';

const API = 'http://localhost:5000/notes';

// ✅ API calls (now with userEmail parameter)
const api = {
  getAll:  (userEmail)           => fetch(`${API}?userEmail=${userEmail}`).then(r => r.json()),
  create:  (data, userEmail)     => fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...data, userEmail}) }).then(r => r.json()),
  update:  (id, data, userEmail) => fetch(`${API}/${id}?userEmail=${userEmail}`, { method: 'PUT',  headers: {'Content-Type':'application/json'}, body: JSON.stringify({...data, userEmail}) }).then(r => r.json()),
  delete:  (id, userEmail)       => fetch(`${API}/${id}?userEmail=${userEmail}`, { method: 'DELETE' }).then(r => r.json()),
};

// ✅ LocalStorage functions for Auth
function getSavedUsers() {
  try {
    const raw = window.localStorage.getItem('notepad_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  window.localStorage.setItem('notepad_users', JSON.stringify(users));
}

function getSavedSession() {
  try {
    const raw = window.localStorage.getItem('notepad_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  window.localStorage.setItem('notepad_session', JSON.stringify(user));
}

function clearSession() {
  window.localStorage.removeItem('notepad_session');
}

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
    </div>
  );
}

export default function App() {
  // ✅ Page routing
  const [page, setPage] = useState('home');
  
  // ✅ Auth state
  const [authUser, setAuthUser] = useState(getSavedSession());
  const [authData, setAuthData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authErrors, setAuthErrors] = useState({});

  // ✅ Notes state
  const [notes, setNotes]         = useState([]);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [editId, setEditId]       = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy]       = useState('date');
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [favorites, setFavorites] = useState([]);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [title, content, editId, loading]);

  // ✅ Load notes on mount and when user changes
  useEffect(() => { 
    if (authUser) {
      loadNotes();
    }
  }, [authUser]);

  // ✅ Persist auth session
  useEffect(() => {
    if (authUser) {
      saveSession(authUser);
    }
  }, [authUser]);

  async function loadNotes() {
    setLoading(true);
    try {
      // Only load if user is logged in
      if (!authUser) {
        setNotes([]);
        return;
      }
      const data = await api.getAll(authUser.email);
      setNotes(data);
    } catch (err) {
      showToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Auth Handlers
  function handleAuthChange(e) {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  }

  function validateSignUp() {
    const errors = {};
    if (!authData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!authData.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!authData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authData.email)) {
      errors.email = 'Enter a valid email.';
    }
    if (!authData.password) {
      errors.password = 'Password is required.';
    } else if (authData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (!authData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (authData.password !== authData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  function handleSignUp() {
    const errors = validateSignUp();
    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }

    const users = getSavedUsers();
    const existing = users.find((user) => user.email.toLowerCase() === authData.email.toLowerCase());
    if (existing) {
      setAuthErrors({ form: 'Account with this email already exists.' });
      return;
    }

    const newUser = {
      firstName: authData.firstName.trim(),
      lastName: authData.lastName.trim(),
      email: authData.email.trim().toLowerCase(),
      password: authData.password,
    };

    users.push(newUser);
    saveUsers(users);
    setAuthErrors({});
    setAuthUser(newUser);
    setPage('home');
    setAuthData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    showToast('✅ Account created! Welcome aboard!', 'success');
  }

  function handleLogin() {
    const errors = {};
    if (!authData.email.trim()) errors.email = 'Email is required.';
    if (!authData.password) errors.password = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }

    const users = getSavedUsers();
    const user = users.find(
      (item) => item.email.toLowerCase() === authData.email.trim().toLowerCase()
    );

    if (!user || user.password !== authData.password) {
      setAuthErrors({ form: 'Invalid email or password.' });
      return;
    }

    setAuthErrors({});
    setAuthUser(user);
    setPage('home');
    setAuthData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    showToast(`🎉 Welcome back, ${user.firstName}!`, 'success');
  }

  function handleLogout() {
    clearSession();
    setAuthUser(null);
    setNotes([]); // Clear notes on logout
    setPage('home');
    showToast('👋 Logged out successfully.', 'info');
  }

  function handleAuthSwitch(target) {
    setAuthErrors({});
    setAuthData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setPage(target);
  }

  // Filtered and sorted notes
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  // Save or Update note
  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both title and content', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.update(editId, { title, content }, authUser.email);
        showToast('✅ Note updated successfully!', 'success');
      } else {
        await api.create({ title, content }, authUser.email);
        showToast('✅ Note created successfully!', 'success');
      }
      setTitle('');
      setContent('');
      setEditId(null);
      loadNotes();
    } catch (err) {
      showToast('Failed to save note', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Edit note
  function handleEdit(note) {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delete note
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setLoading(true);
    try {
      await api.delete(id, authUser.email);
      showToast('🗑️ Note deleted successfully!', 'success');
      loadNotes();
    } catch (err) {
      showToast('Failed to delete note', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Toggle favorite
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  // Cancel edit
  function handleCancel() {
    setEditId(null);
    setTitle('');
    setContent('');
  }

  // Show toast
  function showToast(message, type = 'info') {
    setToast({ message, type });
  }

  // Calculate statistics
  const totalChars = notes.reduce((sum, note) => sum + note.content.length, 0);
  const totalWords = notes.reduce((sum, note) => sum + note.content.split(/\s+/).length, 0);
  const currentChars = content.length;
  const currentWords = content.split(/\s+/).filter(w => w.length > 0).length;


  return (
    <div className="app-wrapper">
      <NavBar page={page} onNavigate={setPage} authUser={authUser} onLogout={handleLogout} />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}

      {/* ✅ Home Page - Only for logged-in users */}
      {page === 'home' && authUser && (
        <div className="app-container">
          <div className="app-header">
            <h1 className="app-title">📓 My Awesome Notepad</h1>
            <p className="app-subtitle">Create, Edit & Organize Your Notes ✨</p>
            
            {/* Statistics */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-icon">📝</span>
                <div className="stat-info">
                  <div className="stat-label">Total Notes</div>
                  <div className="stat-value">{notes.length}</div>
                </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-info">
              <div className="stat-label">Total Words</div>
              <div className="stat-value">{totalWords}</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔤</span>
            <div className="stat-info">
              <div className="stat-label">Total Chars</div>
              <div className="stat-value">{totalChars}</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-info">
              <div className="stat-label">Favorites</div>
              <div className="stat-value">{favorites.length}</div>
            </div>
          </div>
        </div>
          </div>

          {/* Form Card */}
            {/* Form Card */}
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">
                {editId ? '✏️ Update Your Note' : '✨ Create New Note'}
              </h2>
              {editId && <span className="edit-badge">EDITING</span>}
            </div>

            <input
              className="form-input"
              placeholder="Enter note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />

            {/* Character Counter */}
            <div className="textarea-wrapper">
              <textarea
                className="form-textarea"
                placeholder="Write your thoughts, ideas, and important information..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={loading}
                rows={5}
              />
              <div className="char-counter">
                <span>{currentChars} chars</span>
                <span>{currentWords} words</span>
              </div>
            </div>

            <div className="button-group">
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? '⏳ Saving...' : (editId ? '💾 Update Note' : '➕ Add Note')}
              </button>
              {editId && (
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
            <p className="keyboard-hint">💡 Tip: Press Ctrl+S to save, Esc to cancel</p>
          </div>

          {/* Search and Sort */}
          <div className="controls-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search notes by title or content..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="sort-box">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort"
                className="sort-select" 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="date">📅 Newest First</option>
                <option value="oldest">📆 Oldest First</option>
                <option value="title">🔤 Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="notes-section">
            {sortedNotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-text">
                  {searchTerm ? `No notes found for "${searchTerm}"` : 'No notes yet! Create your first note to get started.'}
                </p>
              </div>
            ) : (
              <div className="notes-grid">
                <h2 className="notes-title">
                  📚 Your Notes ({sortedNotes.length})
                  {searchTerm && ` - Searching for "${searchTerm}"`}
                </h2>
                <div className="notes-container">
                  {sortedNotes.map((note, idx) => (
                    <div 
                      key={note._id} 
                      className={`note-card ${favorites.includes(note._id) ? 'favorite' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="note-header">
                        <div className="title-section">
                          <h3 className="note-title">{note.title}</h3>
                          <button 
                            className="favorite-btn"
                            onClick={() => toggleFavorite(note._id)}
                            title={favorites.includes(note._id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {favorites.includes(note._id) ? '⭐' : '☆'}
                          </button>
                        </div>
                        <div className="note-date">
                          {new Date(note.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: new Date(note.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </div>
                      </div>
                      <p className="note-content">{note.content}</p>
                      <div className="note-stats">
                        <span className="note-stat">📝 {note.content.split(/\s+/).length} words</span>
                        <span className="note-stat">🔤 {note.content.length} chars</span>
                      </div>
                      <div className="note-actions">
                        <button className="btn btn-edit" onClick={() => handleEdit(note)}>✏️ Edit</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(note._id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Home Page - Landing for non-logged-in users */}
      {page === 'home' && !authUser && (
        <div className="landing-page">
          <div className="landing-hero">
            <h1 className="landing-title">📓 My Awesome Notepad</h1>
            <p className="landing-subtitle">
              Create, organize, and manage all your notes in one beautiful place.
            </p>
            <p className="landing-features">
              ✨ Beautiful Design • 🔍 Smart Search • ⭐ Favorites • 💬 Real-time Sync
            </p>
            <div className="landing-buttons">
              <button className="btn btn-primary" onClick={() => setPage('signup')}>
                ➕ Create Account
              </button>
              <button className="btn btn-secondary" onClick={() => setPage('login')}>
                🔐 Login
              </button>
            </div>
          </div>
          <div className="landing-demo">
            <div className="demo-card">
              <h3>✍️ Write</h3>
              <p>Quickly jot down your thoughts and ideas.</p>
            </div>
            <div className="demo-card">
              <h3>🔍 Find</h3>
              <p>Search through all your notes instantly.</p>
            </div>
            <div className="demo-card">
              <h3>⭐ Organize</h3>
              <p>Mark favorites and sort by date or title.</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Login Page */}
      {page === 'login' && (
        <AuthForm
          type="login"
          data={authData}
          errors={authErrors}
          loading={loading}
          onChange={handleAuthChange}
          onSubmit={handleLogin}
          onSwitch={handleAuthSwitch}
        />
      )}

      {/* ✅ Sign Up Page */}
      {page === 'signup' && (
        <AuthForm
          type="signup"
          data={authData}
          errors={authErrors}
          loading={loading}
          onChange={handleAuthChange}
          onSubmit={handleSignUp}
          onSwitch={handleAuthSwitch}
        />
      )}
    </div>
  );
}
