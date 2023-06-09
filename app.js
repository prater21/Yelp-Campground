if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

//routes
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const secret = process.env.SECRET || 'thisissecret!Ineedbettersecret';

//connect mongoose
mongoose.set('strictQuery', true);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

//ejs setting
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//req.body data parse
app.use(express.urlencoded({ extended: true }));
//to send http request(delete, post, put)
app.use(methodOverride('_method'))
//to use stastic files
app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})
store.on("error", function (e) {
    console.log("session store error", e)
})

//session
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //for extra security 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //a week after 
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render("main");
})

//위에 route랑 매치 안되는거 다 여기로
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
