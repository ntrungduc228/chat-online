const express = require('express');
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const connectFlash = require('connect-flash');
const session = require('./config/session.config');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');

const initSockets = require('./sockets/');
const routes = require('./routes');
const db = require('./config/db.config');

const cookieParser = require('cookie-parser');
const configSocketIo = require('./config/socketio.config');
const events = require('events');
const configParams = require('./config/app.config');

// Init app express

const app = express();

// Set max connection event listeners
events.EventEmitter.defaultMaxListeners = configParams.max_event_listeners;

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable flash messages
app.use(connectFlash());

// Use Cookie parser
app.use(cookieParser());

// Config session
session.config(app);

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
db.connect();

configSocketIo(io, cookieParser, session.sessionStore);



// Config view engine
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', require('express-ejs-extend'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

routes(app);

initSockets(io);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server app listening at ${PORT}`)
});



// const pem = require('pem');
// const https = require('https');
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
//     const app = express();

//     app.use(cors());
//     app.use(express.urlencoded({ extended: true }));
//     app.use(express.json());
    
//     // Enable flash messages
//     app.use(connectFlash());
    
//     // Config session
//     configSession.config(app);
    
//     // Config passport js
//     app.use(passport.initialize());
//     app.use(passport.session());
    
//     // Connect to MongoDB
//     db.connect();
    
//     // Config view engine
//     app.use(express.static(path.join(__dirname, 'public')));
//     app.engine('ejs', require('express-ejs-extend'));
//     app.set("view engine", "ejs");
//     app.set("views", path.join(__dirname, 'views'));
    
//     routes(app);

//     const PORT = process.env.PORT || 3000;
//     https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(PORT, () => {
//         console.log(`Server app listening at ${PORT}`)
//     })
//   })

