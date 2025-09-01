//depedencies
const path = require('node:path')
const express = require('express')
const session = require('express-session')
const fileUploaderRouter = require('./routes/fileUploaderRouter')
const { PrismaClient } = require('./generated/prisma')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const passport = require('passport')

// Load environment variables
require('dotenv').config();

//express initialization
const app = express()
const PORT = process.env.PORT || 3000

//view engine setup, using EJS
//app.set('views', path.join(__dirname, 'views')) might be unnecessary
app.set('view engine', 'ejs')

//static files middleware, e.g css files
const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//initializing cloudinary
require('./config/cloudinary')

// Session configuration with PostgreSQL and prisma ORM store
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        }
    ),
    cookie: {
        maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 //equals 1 day
    }
}))

//initialize passport middleware
app.use(passport.session())

//routes middleware
app.use(fileUploaderRouter)

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport')

app.listen(3000, (error) => {
    if(error)
        throw error

    console.log(`app listening on post ${PORT}!`)
})