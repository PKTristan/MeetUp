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





module.exports = router;
