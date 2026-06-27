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
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  userEmail: { type: String, required: true }, // जिस user का note है
}, { timestamps: true }); // createdAt, updatedAt auto add होगा

const Note = mongoose.model('Note', noteSchema);

// -----------------------------------------------
// ✅ CRUD Routes
// -----------------------------------------------

// CREATE — नया note बनाओ
app.post('/notes', async (req, res) => {
  try {
    // userEmail required है
    if (!req.body.userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL — सभी notes लाओ (सिर्फ logged-in user के)
app.get('/notes', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    // सिर्फ इस user के notes लाओ
    const notes = await Note.find({ userEmail }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE — एक note लाओ (ownership check के साथ)
app.get('/notes/:id', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note नहीं मिला' });
    // Check: क्या ये note इसी user का है?
    if (note.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized: Not your note' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE — note बदलो (ownership check के साथ)
app.put('/notes/:id', async (req, res) => {
  try {
    const userEmail = req.query.userEmail || req.body.userEmail;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    // पहले check करो कि note किसका है
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) return res.status(404).json({ error: 'Note नहीं मिला' });
    if (existingNote.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized: Not your note' });
    }
    // अब update करो
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE — note हटाओ (ownership check के साथ)
app.delete('/notes/:id', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    // पहले check करो कि note किसका है
    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) return res.status(404).json({ error: 'Note नहीं मिला' });
    if (existingNote.userEmail !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized: Not your note' });
    }
    // अब delete करो
    const note = await Note.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Note delete हो गया' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Server start
app.listen(5000, () => console.log('🚀 Server चल रहा है: http://localhost:5000'));
