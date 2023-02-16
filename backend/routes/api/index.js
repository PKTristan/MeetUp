// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');


//GCOnnect restoreUser middleware to the API router
    //if current user session is valid, set req.user to the user inn the database
    //if current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
    res.json({
        requestBody: req.body
    });
});

module.exports = router;
