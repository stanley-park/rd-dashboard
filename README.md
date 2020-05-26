# rd-dashboard
spending dashboard

# Build instructions:
- Download the zip and extract
- Install node modules in /respondent/client and /respondent/server 
  - (`cd client`, `npm install`, `cd ..`, `cd server`, `npm install`)
- `cd`. into /respondent/server/data
- Start the mongodb daemon in /respondent/server/data by running `mongod --dbpath .` (can replace . with path to server/data)
- If error occurs like "mongod command not found", try entering this into terminal: 
  - `export PATH="$PATH:/usr/local/mongodb/bin"`
  - (from https://stackoverflow.com/questions/22862808/mongod-command-not-found-os-x)
- Verify mongod is running and says Listening on 127.0.0.1 and on port 27017
- If it is stuck waiting, there may be another process using port 27017
- The database is configured to run on default port (27017), but changes can be made at /respondent/server/config/index.js
- Start client and server: 
  - in terminal at /respondent/server: node server.js
  - in another terminal at /respondent/client: npm run dev
- A new window should open at localhost:8080/#/. If not, enter the address in and a "Welcome Back, User 12345678910" card should show up on the spending dashboard
- Everything is now ready to go/play around
