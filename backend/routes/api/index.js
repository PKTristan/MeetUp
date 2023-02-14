// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// testing router
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

//GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res, user);
    return res.json();
});

//GET /api/restore-user
router.use(restoreUser);

router.get(
    '/restore-user',
    (req, res) => {
        return res.json(req.user);
    }
);

module.exports = router;
