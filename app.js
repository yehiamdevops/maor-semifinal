const express = require('express');
const cors = require('cors');
const http = require('http');
const connectToDB = require('./db/mongoConnect.js');
const Routes  = require('./routes/ConfigRoutes.js');
const { HOST, PORT } = require('./secret/configlist.js');
connectToDB();
const app = express();
app.use(express.json());//middleware
app.use(cors());//middleware
Routes(app);
app.use(express.static('public'));
const server = http.createServer(app);
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});

