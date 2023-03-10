// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuthentication } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User } = require('../../db/models');

const router = express.Router();

//middleware to validate the credentials and password
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// SIgn up
router.post('/', validateSignup, async (req, res, next) => {
    try {
        const { email, firstName, lastName, password, username } = req.body;
        const user = await User.signup({ username, email, firstName, lastName, password });

        await setTokenCookie(res, user);

        return res.json({
            user
        });
    } catch (e) {
        return next(e);
    }
});




module.exports = router;
