const express = require('express');
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const connectFlash = require('connect-flash');
const session = require('express-session')

const routes = require('./routes');
const db = require('./config/db.config');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable flash messages
app.use(connectFlash());
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

// Connect to MongoDB
db.connect();

// Config view engine
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', require('express-ejs-extend'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));



routes(app);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server app listening at ${PORT}`)
});
