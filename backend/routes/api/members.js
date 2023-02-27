//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Membership, Group } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

const router = express.Router({ mergeParams: true });

//check if the user is the organizer or co host
const isHost = async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = req;
    req.roles = { isHost: false };

    try {
        const group = await Group.findByPk(groupId);
        const member = await Membership.findAll({
            where: { userId: user.id, groupId }
        });

        if (group.organizerId === user.id) {
            req.roles.isHost = true;
        }

        if (member.status === 'co-host') {
            req.roles.isHost = true;
        }

        next();
    }
    catch (err) {
        next(err);
    }
};

//get all members
router.get('/', isHost, async (req, res, next) => {
    const { groupId } = req.params;

    try {
        if (req.roles.isHost) {
            const members = await Membership.getMembersBy({ groupId });

            return res.json(members);
        }
        else {
            const members = await Membership.getMembersBy({ status: ['approved', 'co-host'], groupId });

            return res.json(members);
        }
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
