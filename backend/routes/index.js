// backend/routes/index.js
const express = require('express');
const { requireAuthorization } = require('../utils/auth');
const router = express.Router();
const apiRouter = require('./api');

router.use('/api', apiRouter);      //all the routes in api router will be prefixed with /api

//static routes
//serve react build files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');

    //serve the frontend's index.html file at the root route
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });

    //serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/build")));

    //serve the frontend's index.html file at all other routes NOT nstarting with /api
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        const csrfToken = req.csrfToken();
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({
            'XSRF-Token': csrfToken
        });
    });

    router.get('/api/test', requireAuthorization, (req, res)=> {
        return res.json({
            test:'this is a test check console',
            'url': req.originalUrl
        });
    })
}

// Add an XSRF-TOKEN cookie
router.get('/api/csrf/restore', function (req, res) {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});


module.exports = router;
