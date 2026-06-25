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