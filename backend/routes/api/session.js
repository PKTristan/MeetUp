// backend/routes/api/session.js
const express = require ('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Login
router.post('/', async (req, res, next) => {
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
})

module.exports = router;
