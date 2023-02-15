// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');


//GCOnnect restoreUser middleware to the API router
    //if current user session is valid, set req.user to the user inn the database
    //if current user session is not valid, set req.user to null
router.use(restoreUser);

module.exports = router;
