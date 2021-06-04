# Twitter Clone Based on Gun DB

This Twitter Clone is using the Gun DB as backend storage and network distribution.
The intention is to demo a decentralized peer-to-peer single-room discussion forum.
The governance model leverage a Trust-based system for managing content on a server from a subjective view.
The combination of Gun DB and Trust governance allows the Twitter Clone to function effectively with a high number of users in a single room.

# Install

npm install

Gun DB may need to be installed directly from github as the npm package can be old.

npm install git+https://github.com/gundb/gun.git

npm audit fix --force



# Run

npm start

# Start Gun Server

cd node_modules

cd gun

npm start
