//backend/routes/api/venues.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Venue, User, GroupImage } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

const router = express.Router();

//get all venues specified by groupId or venueId
router.get('/', async (req, res, next) => {
    const groupId = req.roles.groupId;
    console.log(groupId);

    if (groupId) {
        try {
            const venues = await Venue.getVenuesBy({groupId});

            return res.json(venues);
        }
        catch (e) {
            next(e);
        }
    }

    return res.json(req.body);
});


module.exports = router;
