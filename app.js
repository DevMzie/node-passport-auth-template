const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()
const port = 5050

// Pssport Config
require('./config/passport')(passport)

//  DB Config
const db = require('./config/keys').MongoURI
mongoose.connect(db, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('\x1b[33m%s\x1b[0m','MongoDB Connected...'))
.catch(err => console.error(err))

// BodyParser 
app.use(express.urlencoded({extended: false}))

// Express Session
app.use(session({
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: true, 
    // cookie: {secure: true}
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect-Flash
app.use(flash())

// Global Variables
app.use((req, res, next) =>{
    res.locals.successMessage = req.flash('successMessage')
    res.locals.errorMessage = req.flash('errorMessage')
    res.locals.error = req.flash('error')

    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// EJS 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.listen(port, ()=>{
    console.log(`Server now running on port ${port}`);
})
  