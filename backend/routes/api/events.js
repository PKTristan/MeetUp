//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Event, Group, Venue } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router({ mergeParams: true });

//check if events exists
const exists = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.eventId);

        if (!event) {
            const err = new Error("Event couldn't be found");
            err.error = "Event couldn't be found";
            err.status = 404;

            throw err;
        }

        next();
    }
    catch (err) {
        throw err;
    }
}

//get all events
router.get('/', async (req, res, next) => {
    const { groupId } = req.params;
    const whereObj = (groupId) ? { groupId } : {};
    console.log(whereObj);

    try {
        const events = await Event.getEventsBy(whereObj);

        return res.json(events);
    }
    catch (err) {
        next(err);
    }
});

//get event by id
router.get('/:eventId', exists, async (req, res, next) => {
    const id = req.params.eventId;

    try {
        const event = await Event.getEventsBy({ id });

        return res.json(event);
    }
    catch (err) {
        next(err);
    }
});

//////////////////////////////////////////////////////

//add create event roles
const addCreateRoles = async (req, res, next) => {
    req.roles = {
        organizer: true,
        member: {
            status: 'co-host'
        },
        groupId: req.params.groupId
    }

    next();
}

//validate in person or online
const validateType = (value, { req }) => {
    const typeLow = value.toLowerCase();

    if (typeLow === 'online') {
        req.type = 'Online';
        return true;
    }
    else if (typeLow === 'in person') {
        req.type = 'In Person';
        return true;
    }

    return false;
};

//is start date before end date
const isDateAfter = (value, { req }) => {
    const date1 = new Date(value);
    const date2 = new Date(req.body.startDate);


    return date1.getTime() > date2.getTime();
}

//checks if the date is in the future
const isInFuture = (value) => {
    const date1 = new Date(value);
    const date2 = new Date();


    return date1.getTime() > date2.getTime();
}

//check for venue existence
const venueExists = async (value) => {
    const venue = await Venue.findByPk(value);

    console.log(venue);

    return !!venue;
};

//validate the events data
const validateEvent = [
    check('venueId')
        .optional({ nullable: true })
        .custom(async (value) => {


            const venue = await Venue.findByPk(value);
            console.log(venue)
            if (!venue) {
                const err = new Error('Venue does not Exist');
                err.status = 404;
                throw err;
            }

        })
        .withMessage("Venue does not exist"),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .if(validateType)
        .withMessage("Type must be Online or In person"),
    check('capacity')
        .exists({ checkFalsy: true })
        .if((value) => Number.isInteger(value))
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .if((value) => !isNaN(parseFloat(value)))
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('startDate')
        .exists({ checkFalsy: true })
        .isISO8601({ format: 'YYYY-MM-DD HH:mm:ss' })
        .withMessage('startDate must be in correct format yyyy:mm:dd hh:mm:ss')
        .if(isInFuture)
        .withMessage("Start date must be in the future"),
    check('endDate')
        .exists({ checkFalsy: true })
        .isISO8601({ format: 'YYYY-MM-DD HH:mm:ss' })
        .withMessage('endDate must be in correct format yyyy:mm:dd hh:mm:ss')
        .if(isDateAfter)
        .withMessage("End date is less than start date"),
    handleValidationErrors
];

//route to create event
router.post('/', requireAuthentication, validateEvent, addCreateRoles, requireAuthorization,
    async (req, res, next) => {
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
        const { groupId } = req.params;

        try {
            const event = await Event.createEvent({ groupId, venueId, name, type, capacity, price, description, startDate, endDate });

            return res.json(event);
        }
        catch (e) {
            next(e);
        }
    });

module.exports = router;
