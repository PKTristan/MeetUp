//backend/routes/api/attendees.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Attendance, Group, Event } = require('../../db/models');
const { Sequelize, Op, EmptyResultError } = require('sequelize');

const router = express.Router({ mergeParams: true });

//check if the user is the organizer or co host
const isHost = async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;
    req.roles = { isHost: false };

    try {
        const event = await Event.findByPk(eventId);
        const group = await Group.findByPk(event.groupId);
        const attendance = await Attendance.findAll({
            where: { userId: user.id, eventId}
        });

        if (group.organizerId === user.id) {
            req.roles.isHost = true;
        }

        if (attendance.status === 'co-host') {
            req.roles.isHost = true;
        }

        next();
    }
    catch (err) {
        next(err);
    }
};

//get all attendances specified by object
router.get('/', isHost, async(req, res, next) => {
    const {eventId} = req.params;

    try {
        if (req.roles.isHost) {
            const attendees = await Attendance.getAttendeesBy({ eventId });

            return res.json(attendees);
        }
        else {
            const attendees = await Attendance.getAttendeesBy({ status: ['member', 'co-host'], groupId });

            return res.json(attendees);
        }
    }
    catch (err) {
        next(err);
    }
});

//////////////////////////////////


//request attendance
router.post('/', async(req, res, next) => {
    const userId = req.user.id;;
    const {eventId} = req.params;
    const status = 'pending';

    try {
        const response = await Attendance.requestAttendance({userId, eventId, status});

        res.json(response);
    }
    catch(err) {
        next(err);
    }
});

// add auth roles
const addStatusRoles = async (req, res, next) => {
    const { userId, status } = req.body;
    const {eventId} = req.params;
    const event = await Event.findByPk(eventId);
    console.log(req.roles)


    if (status === 'member') {
        req.roles = {
            organizer: true,
            member: {
                status: 'co-host'
            },
            groupId: event.groupId
        }
        next();
    }
    else if (status === 'co-host') {
        req.roles = {
            organizer: true,
            groupId: event.groupId
        }
        next();
    }
    else {
        const err = new Error('not a valid status');

        next(err);
    }
}


//update attendance
router.put('/', addStatusRoles, requireAuthorization, async(req, res, next) => {
    const {userId, status} = req.body;
    const {eventId} = req.params;

    try {
        const attendance = await Attendance.updateAttendee({userId, eventId, status});

        return res.json(attendance);
    }
    catch (e) {
        next(e);
    }
});


module.exports = router;
