const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const chalk = require('chalk');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
let mongoStore = require('connect-mongo')(session);
require('dotenv').config();
require('./lib/passport')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/userRoutes');

const app = express();

//! Connect DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log(chalk.cyan('MongoDB Connected'));
    })
    .catch(err => console.log(`MongoDB error ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash()); //need this to display flash messages

//Session Middleware
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: new mongoStore({
            url: process.env.MONGO_URI,
            autoReconnect: true,
            cookie: { maxAge: 60000 }
        })
    })
);

// middleware for passport and session. make sure its under session middleware
app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
