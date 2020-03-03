const {check} = require('express-validator')

const userValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Include a valid email').isEmail(),
    check('password', 'Password must be longer than 3 characters').isLength({ min: 3 })
];

module.exports = userValidation