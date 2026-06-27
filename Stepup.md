## OS Ubuntu 22.xx [ ]
Check 

node -v

if not then intall

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

npm -v


Install MongoDB

1. MongoDB की key add करो
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

2. Repository add करो (Ubuntu 22.04 = jammy)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

3. Update करो
sudo apt update

4. Install करो
sudo apt install -y mongodb-org

5. Start करो
sudo systemctl start mongod

6. Check करो — "active (running)" दिखे
sudo systemctl status mongod


Tab 1 — MongoDB start 

sudo systemctl start mongod
sudo systemctl status mongod

Tab 2 — Backend Run

cd "/media/vishal/SATA/My Cource/Project's/Notepad-project/files/backend"
npm install
node server.js

Check: http://localhost:5000


Tab 3 — Frontend Run

cd "/media/vishal/SATA/My Cource/Project's/Notepad-project/files/frontend"
npm install
npm start

Check: http://localhost:3000



Database testing :

Certainly! Here's a complete, step-by-step set of commands to start from scratch with MongoDB, set up your database, and perform basic operations:



1. Start MongoDB Service

```bash
 systemctl start mongod
```

2. Open Mongo Shell

```bash
mongosh
```

3. Create or Switch to Your Database

```js
// List existing databases
show dbs

// Switch to your database (creates it if it doesn't exist)
use notepad
```

4. Create a Collection (if not already created)

```js
// Create 'notes' collection
db.createCollection("notes")
```

5. Insert Sample Notes with `userEmail`

```js
db.notes.insertMany([
  {
    title: "First Note",
    content: "This is Alice's note.",
    userEmail: "alice@example.com",
    createdAt: new Date()
  },
  {
    title: "Second Note",
    content: "This is Bob's note.",
    userEmail: "bob@example.com",
    createdAt: new Date()
  }
])
```

6. Query All Notes

```js
db.notes.find().pretty()
```

7. Verify Notes for Specific Users

- Alice:

```js
db.notes.find({ userEmail: "alice@example.com" }).pretty()
```

- Bob:

```js
db.notes.find({ userEmail: "bob@example.com" }).pretty()
```

8. Create an Index on `userEmail` for faster queries

```js
db.notes.createIndex({ userEmail: 1 })
```

9. Add a New Note

```js
db.notes.insertOne({
  title: "Third Note",
  content: "This is another note for Alice.",
  userEmail: "alice@example.com",
  createdAt: new Date()
})
```

10. Update a Note (by `_id`)

```js
db.notes.updateOne(
  { _id: ObjectId("your_note_id") },
  { $set: { title: "Updated Title" } }
)
```

*(Replace `"your_note_id"` with the actual `_id`.)*


11. Delete a Note (by `_id`)

```js
db.notes.deleteOne({ _id: ObjectId("your_note_id") })
```

12. Count Total Notes

```js
db.notes.countDocuments()
```

13. Drop the Collection (if needed)

```js
db.notes.drop()
```

14. Create a User with Permissions

```js
use admin
db.createUser({
  user: "notepadUser",
  pwd: "securePassword",
  roles: [ { role: "readWrite", db: "notepad" } ]
})
```

15. Authenticate as the User

```bash
mongosh -u notepadUser -p --authenticationDatabase notepad
```
