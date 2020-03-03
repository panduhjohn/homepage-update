const express = require('express');
const router = express.Router();

const items = require('../lib/loader');

//Render homepage
router.get('/', (req, res, next) => {
    return res.render('main/home', { items });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;
