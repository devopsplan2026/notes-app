# 📒 Notepad App — Node.js + React + MongoDB

## Tech Stack
| Layer      | Technology        | 
|------------|-------------------|
| Backend    | Node.js + Express |
| Frontend   | React             |
| Database   | MongoDB           |

---

## ▶️ कैसे चलाएं (Locally)

### Step 1 — MongoDB
```bash
mongod
``

---

### Step 2 — Backend 
```bash
cd backend
npm install
npm run dev
```
✅ Server चलेगा: http://localhost:5000

---

### Step 3 — Frontend 
```bash
cd frontend
npm install
npm start
```
✅ App खुलेगा: http://localhost:3000

---

## 🔁 CRUD Operations ()

| Operation | Route              | Work                    |
|-----------|--------------------|-------------------------|
| Create    | POST   /notes      | New note create         |
| Read All  | GET    /notes      | get all notes           |
| Read One  | GET    /notes/:id  | get  one note           |
| Update    | PUT    /notes/:id  | note update             |
| Delete    | DELETE /notes/:id  | note delete             |

---

## 📁 Folder Structure
```
notepad-app/
├── backend/
│   ├── server.js       ← सभी API routes यहाँ हैं
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js      ← पूरा UI यहाँ है
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```
