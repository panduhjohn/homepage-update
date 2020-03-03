const express = require('express');
const router = express.Router();

const passport = require('passport');
require('../../lib/passport');

const userController = require('./controllers/userController');
const userValidation = require('./utils/userValidation');

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

//register routes
router.get('/register', (req, res) => {
    //this message will flash from userController if there is a user after we try and find one in register function.
    res.render('auth/register');
});

// router.get('/register', userController.getRegister)
router.post('/register', userValidation, userController.register);

// router.get('/login', (req, res) => {
//     //if user is authenticated it redirects to homepage, if not then back to login page
//     if (req.isAuthenticated()) {
//         return res.redirect('/')
//     }
//     return res.redirect('/api/users/login')
// })
router.get('/login', (req, res) => {
    return res.render('auth/login', { errors: req.flash('errors') });
});

router.post(
    '/login',
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/api/users/login',
        failureFlash: true
    })
);

router.get('/profile', (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.render('auth/profile');
    }
    return res.send('Unauthorized. Go Register');
});

module.exports = router;
