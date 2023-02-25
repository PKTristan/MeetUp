// backend/routes/api/session.js
const express = require ('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//validate login middleware
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];


// Login
router.post('/', validateLogin, async (req, res, next) => {
    //parse credential and password from body
    const { credential, password } = req.body;

    //call the login User method
    const user = await User.login({ credential, password });

    // send error if the login failed
    if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
    }

    //if the login didn't fail, set the token cookie
    await setTokenCookie(res, user);

    return res.json({
        user
    });
});

// Logout
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

//restore session user
router.get('/', (req, res) => {
    const { user } = req;

    //return current user
    if(user) {
        return res.json({
            user: user.toSafeObject()
        });
    }
    else return res.json({});
});

module.exports = router;
