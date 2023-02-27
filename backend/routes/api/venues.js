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


//////////////////////////////////////////////

//validate Venue
const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];

//create a venue
router.post('/', validateVenue, async (req, res, next) => {
    const { address, city, state, lat: latitude, lng: longitude } = req.body;
    const {groupId} = req.roles;

    try {
        const venue = await Venue.addVenue({ address, city, state, latitude, longitude, groupId });

        return res.json(venue);
    }
    catch(e) {
        next(e);
    }
});

module.exports = router;
