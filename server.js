const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB से connect करो
mongoose.connect('mongodb://localhost:27017/notepad')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// ✅ Note का structure (Schema)
const noteSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true }); // createdAt, updatedAt auto add होगा

const Note = mongoose.model('Note', noteSchema);

// -----------------------------------------------
// ✅ CRUD Routes
// -----------------------------------------------

// CREATE — नया note बनाओ
app.post('/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — सभी notes लाओ
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — एक note लाओ
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note नहीं मिला' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — note बदलो
app.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: 'Note नहीं मिला' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — note हटाओ
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note नहीं मिला' });
    res.json({ message: '🗑️ Note delete हो गया' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Server start
app.listen(5000, () => console.log('🚀 Server चल रहा है: http://localhost:5000'));
