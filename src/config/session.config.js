const session = require('express-session');
const connectMongo = require('connect-mongo');

const DB_LOCAL_NAME = process.env.DB_LOCAL_NAME || 'chat-online';
const DB_URI = process.env.DB_URI || `mongodb://localhost:27017/${DB_LOCAL_NAME}`;

let mongoStore = connectMongo(session);

/**
 * This variable is where save session, in this case is mongodb
 */

let sessionStore = new mongoStore({
    url: DB_URI,
    autoReconnect: true,
    // autoRemove: "native"
});

/**
 * Config session for app
 *  * @param app from exactly express module
 */
let config = (app) => {
app.use(session({
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 *60 * 24 //86400000 seconds = 1 day
        }
    }));
};

module.exports = {
    config,
    sessionStore,
};