//backend/routes/api/venues.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Venue } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

//check if venue exists
const exists = async (req, res, next) => {
    const id = req.params.venueId;

    try {
        const venue = await Venue.findByPk(id);

        req.roles = {groupId: venue.groupId};

        next();
    }
    catch(e) {
        next(e);
    }
};

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


//edit a venue by its id
router.put('/:venueId', requireAuthentication, exists, validateVenue, requireAuthorization,
    async( req, res, next) => {
        const {venueId} = req.params;
        const { address, city, state, lat:latitude, lng:longitude } = req.body;

        try {
            const venue = await Venue.editVenue({ address, city, state, latitude, longitude }, venueId);

            return res.json(venue);
        }
        catch(e) {
            next(e);
        }
    });

module.exports = router;
