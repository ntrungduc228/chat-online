const express = require('express');
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const connectFlash = require('connect-flash');
const configSession = require('./config/session.config');
const passport = require('passport');

const routes = require('./routes');
const db = require('./config/db.config');

const pem = require('pem');
const https = require('https');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // Enable flash messages
// app.use(connectFlash());

// // Config session
// configSession.config(app);

// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect to MongoDB
// db.connect();



// // Config view engine
// app.use(express.static(path.join(__dirname, 'public')));
// app.engine('ejs', require('express-ejs-extend'));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, 'views'));



// routes(app);



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server app listening at ${PORT}`)
// });




pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
      throw err
    }
    const app = express();

    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    
    // Enable flash messages
    app.use(connectFlash());
    
    // Config session
    configSession.config(app);
    
    // Config passport js
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Connect to MongoDB
    db.connect();
    
    // Config view engine
    app.use(express.static(path.join(__dirname, 'public')));
    app.engine('ejs', require('express-ejs-extend'));
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, 'views'));
    
    routes(app);

    const PORT = process.env.PORT || 3000;
    https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(PORT, () => {
        console.log(`Server app listening at ${PORT}`)
    })
  })

