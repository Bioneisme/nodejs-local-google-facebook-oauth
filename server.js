const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth-route')
const pageRoute = require('./routes/page-route')
require('dotenv').config()
require('./controllers/passport-controller')(passport)

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: 7 * 24 *  60 * 60, // 7 Days
    }),
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log("http://localhost:" + PORT))
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

app.use('/api', authRoute)
app.use(pageRoute)

start()