/**
* users routes
*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//go to register page
router.get('/register', (req, res) => {
    res.render('users/register');
})

//register user
router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to yelpcamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

});

//go to login page
router.get('/login', (req, res) => {
    res.render('users/login');
})

//login
router.post('/login', passport.authenticate('local', { keepSessionInfo: true, failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


//logout
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds')
    });
})

module.exports = router;