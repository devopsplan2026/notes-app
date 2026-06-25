import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/notes';

// ✅ API calls — backend से बात करना
const api = {
  getAll:  ()           => fetch(API).then(r => r.json()),
  create:  (data)       => fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  update:  (id, data)   => fetch(`${API}/${id}`, { method: 'PUT',  headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  delete:  (id)         => fetch(`${API}/${id}`, { method: 'DELETE' }).then(r => r.json()),
};

export default function App() {
  const [notes, setNotes]       = useState([]);
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [editId, setEditId]     = useState(null); // null = नया note, id = edit mode

  // Page load पर सभी notes लाओ
  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const data = await api.getAll();
    setNotes(data);
  }

  // Save button — Create या Update
  async function handleSave() {
    if (!title.trim() || !content.trim()) return alert('Title और Content भरो!');

    if (editId) {
      await api.update(editId, { title, content });
    } else {
      await api.create({ title, content });
    }

    // Form reset
    setTitle('');
    setContent('');
    setEditId(null);
    loadNotes();
  }

  // Edit button — form में data भरो
  function handleEdit(note) {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  }

  // Delete button
  async function handleDelete(id) {
    if (!window.confirm('Note delete करें?')) return;
    await api.delete(id);
    loadNotes();
  }

  // Cancel edit
  function handleCancel() {
    setEditId(null);
    setTitle('');
    setContent('');
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📒 मेरा Notepad</h1>

      {/* ✅ Form — Note लिखो */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Title लिखो..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Content लिखो..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={styles.btnSave} onClick={handleSave}>
            {editId ? '✏️ Update करो' : '➕ Save करो'}
          </button>
          {editId && (
            <button style={styles.btnCancel} onClick={handleCancel}>Cancel</button>
          )}
        </div>
      </div>

      {/* ✅ Notes List */}
      {notes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>कोई note नहीं है। ऊपर से बनाओ!</p>
      ) : (
        <div style={styles.list}>
          {notes.map(note => (
            <div key={note._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{note.title}</h3>
              <p style={styles.cardContent}>{note.content}</p>
              <small style={{ color: '#aaa' }}>
                {new Date(note.createdAt).toLocaleString('hi-IN')}
              </small>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button style={styles.btnEdit}   onClick={() => handleEdit(note)}>✏️ Edit</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(note._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Simple styles
const styles = {
  page:        { maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' },
  heading:     { textAlign: 'center', color: '#333' },
  form:        { background: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 },
  input:       { padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' },
  textarea:    { padding: 10, fontSize: 15, borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' },
  btnSave:     { padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' },
  btnCancel:   { padding: '10px 20px', background: '#aaa',    color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  list:        { display: 'flex', flexDirection: 'column', gap: 14 },
  card:        { background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  cardTitle:   { margin: '0 0 6px', color: '#222' },
  cardContent: { margin: '0 0 6px', color: '#555' },
  btnEdit:     { padding: '6px 14px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
  btnDelete:   { padding: '6px 14px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
};
