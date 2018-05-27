Please run the following:
> npm install --save sqlite3
> npm install --save express
> npm install --save node-rest-client

To start the server, run `node app.js`

You'll discover that the /getTransactions and /getBalance endpoints return the error:
"SQLITE_ERROR: hex literal too big: 0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a"
I spent quite a bit of time trying to get databases configured, and figured it's time to take the loss. My first attempt was with Mongo, but I was unable to solve a bulk upsert issue. I tried setting up Postgres, but was unable to get past the installation. I hope you appreciate my submission regardless. I had a good time doing it.

Mike
