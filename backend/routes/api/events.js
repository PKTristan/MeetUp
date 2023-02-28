//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Event, EventImage, Venue } = require('../../db/models');
const { Sequelize } = require('sequelize');
const attendeesRouter = require('./attendees.js');

const router = express.Router({ mergeParams: true });

//check if events exists
const exists = async (req, res, next) => {
    const id = req.params.eventId;
    try {
        const event = await Event.findByPk(id);

        if (!event) {
            const err = new Error("Event couldn't be found");
            err.error = "Event couldn't be found";
            err.status = 404;

            throw err;
        }


        req.roles = { groupId: event.groupId};

        console.log(req.roles)

        next();
    }
    catch (err) {
        next(err);
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

router.use('/:eventId/attendees', exists, attendeesRouter);

//add event roles
const addEventReqRoles = async(req, res, next) => {
    req.roles.member = {status: 'member'}

    next();
}

router.use('/:eventId/attendance', requireAuthentication, exists, attendeesRouter);


//////////////////////////////////////////////////////

//add create event roles
const addCreateRoles = async (req, res, next) => {
    if(!req.roles) {req.roles = {groupId: req.params.groupId}};
    req.roles.organizer = true;
    req.roles.member = { status: 'co-host' };


    next();
};

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

//add image to event roles
const addImageRoles = async (req, res, next) => {
    req.roles = {
        attendee: ['member', 'host', 'co-host'],
        eventId: req.params.eventId
    }

    next();
};

//validate image
const validateImage = [
    check('url')
        .exists({ checkFalsy: true })
        .isURL()
        .withMessage("must provide valid url"),
    check('preview')
        .exists()
        .isBoolean()
        .withMessage("must provide preview option"),
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

//add an image to an event based on an eventId
router.post('/:eventId/images', requireAuthentication, exists, validateImage, addImageRoles, requireAuthorization,
    async (req, res, next) => {
        const { url, preview } = req.body;
        const { eventId } = req.params;

        try {
            const image = await EventImage.addImage({ eventId, url, preview });

            return res.json(image);
        }
        catch (e) {
            next(e);
        }
    });


//edit an event specified by its id
router.put('/:eventId', requireAuthentication, exists, validateEvent, addCreateRoles, requireAuthorization,
    async (req, res, next) => {
        const { eventId } = req.params;
        const { groupId, venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        try {
            const event = await Event.editEvent({ groupId, venueId, name, type, capacity, price, description, startDate, endDate },
                eventId);

            return res.json(event);
        }
        catch (err) {
            next(err);
        }
    });

//delete an event by its id
router.delete('/:eventId', requireAuthentication, exists, addCreateRoles, requireAuthorization,
    async (req, res, next) => {
        const { eventId } = req.params;

        try {
            const del = await Event.deleteEvent(eventId);

            if (del) {
                return res.json({ message: 'Successfully deleted', statusCode: 200 });
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
