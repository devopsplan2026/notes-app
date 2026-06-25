# 📒 Notepad App — Node.js + React + MongoDB

## Tech Stack
| Layer      | Technology        | 
|------------|-------------------|
| Backend    | Node.js + Express |
| Frontend   | React             |
| Database   | MongoDB           |

---

## ▶️ कैसे चलाएं (Locally)

### Step 1 — MongoDB चालू करो
```bash
mongod
```
> अगर MongoDB install नहीं है: https://www.mongodb.com/try/download/community

---

### Step 2 — Backend चालू करो
```bash
cd backend
npm install
npm run dev
```
✅ Server चलेगा: http://localhost:5000

---

### Step 3 — Frontend चालू करो
```bash
cd frontend
npm install
npm start
```
✅ App खुलेगा: http://localhost:3000

---

## 🔁 CRUD Operations (क्या-क्या होता है)

| Operation | Route              | काम                     |
|-----------|--------------------|--------------------------|
| Create    | POST   /notes      | नया note बनाओ           |
| Read All  | GET    /notes      | सभी notes लाओ           |
| Read One  | GET    /notes/:id  | एक note लाओ             |
| Update    | PUT    /notes/:id  | note बदलो               |
| Delete    | DELETE /notes/:id  | note हटाओ               |

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
