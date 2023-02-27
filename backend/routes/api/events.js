//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Event, Group, Venue } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

//get all events
router.get('/', async(req, res, next) => {
    try {
        const events = await Event.findAll({
            attributes: {
                include: [
                    'id',
                    'groupId',
                    'venueId',
                    'name',
                    'type',
                    'startDate',
                    'endDate',
                    [
                        Sequelize.literal('(SELECT COUNT(*) FROM Attendances WHERE Attendances.eventId = Event.id AND Attendances.status = "Going")'),
                        'numAttending'
                    ],
                    [
                        Sequelize.literal(
                            `(SELECT url FROM EventImages WHERE EventImages.eventId = Event.id AND EventImages.preview = true)`
                        ),
                        'previewImage'
                    ]
                ],
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Group,
                    attributes: ['id', 'name', 'city', 'state']
                },
                {
                    model: Venue,
                    attributes: ['id', 'city', 'state']
                }
            ]
        });

        return res.json(events);
    }
    catch(err) {
        next(err);
    }
});

//////////////////////////////////////////////////////

module.exports = router;
