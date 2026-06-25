import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:5000/notes';

// ✅ API calls
const api = {
  getAll:  ()           => fetch(API).then(r => r.json()),
  create:  (data)       => fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  update:  (id, data)   => fetch(`${API}/${id}`, { method: 'PUT',  headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  delete:  (id)         => fetch(`${API}/${id}`, { method: 'DELETE' }).then(r => r.json()),
};

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
  const [notes, setNotes]         = useState([]);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [editId, setEditId]       = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy]       = useState('date');
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Keyboard shortcuts
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
  }, [title, content, editId]);

  // Load notes on mount
  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    setLoading(true);
    try {
      const data = await api.getAll();
      setNotes(data);
    } catch (err) {
      showToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
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
        await api.update(editId, { title, content });
        showToast('✅ Note updated successfully!', 'success');
      } else {
        await api.create({ title, content });
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
      await api.delete(id);
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
    <div className="app-container">
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
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
  );
}
