const User = require('../models/User');
const { validationResult } = require('express-validator');
const faker = require('faker')

module.exports = {
    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                // return req.flash('errors', 'User already exists');
                return res.send('User Exists');
            } else {
                const newUser = new User();

                newUser.profile.name = req.body.name;
                newUser.profile.picture = faker.image.avatar()
                newUser.email = req.body.email;
                newUser.password = req.body.password;

                newUser
                    .save()
                    .then(user => {
                        req.login(user, err => {
                            if (err) {
                                return res.status(400).json({
                                    confirmation: false,
                                    message: err
                                });
                            } else {
                                return res.redirect('/');
                                // next();
                            }
                        });
                    })
                    .catch(err => {
                        return next(err);
                    });
            }
        })
        .catch(err => console.log(err))
    }

    // getRegister: (req, res) => {
    //     res.render('auth/register');
    // }
};

//! Register with async/await
// register: async (req, res, next) => {
//     const errors = validationResult(req);
//     const { name, email, password } = req.body;

//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }

//     let user = await User.findOne({ email });

//     try {
//         if (user) {
//             return res.status(500).json({ message: 'User already exists' });
//         }

//         user = await User.create({
//             ['profile.name']: name,
//             email,
//             password
//         });

//         return res.json({ message: 'Success', user });
//     } catch (error) {
//         return next(error);
//     }
// }
