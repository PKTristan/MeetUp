//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Event, Group, Venue } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router({mergeParams: true});

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
router.get('/', async(req, res, next) => {
    const {groupId} = req.params;
    const whereObj = (groupId) ? {groupId} : {};
    console.log(whereObj);

    try {
        const events = await Event.getEventsBy(whereObj);

        return res.json(events);
    }
    catch(err) {
        next(err);
    }
});

//get event by id
router.get('/:eventId', exists, async (req, res, next) => {
    const id = req.params.eventId;

    try {
        const event = await Event.getEventsBy({id});

        return res.json(event);
    }
    catch(err) {
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



module.exports = router;
