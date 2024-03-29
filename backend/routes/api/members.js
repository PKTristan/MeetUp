//backend/routes/api/members.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Membership, Group } = require('../../db/models');
const { Sequelize, Op, EmptyResultError } = require('sequelize');

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
            const members = await Membership.getMembersBy({ status: ['member', 'co-host'], groupId });

            return res.json(members);
        }
    }
    catch (err) {
        next(err);
    }
});

////////////////////////////////////////

//request a membership
router.post('/', async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    const status = 'pending'

    try {
        const member = await Membership.requestMembership({ userId, groupId: parseInt(groupId), status });

        res.json(member);
    }
    catch (err) {
        next(err);
    }
});


//change memberhsip stsatus
router.put('/', requireAuthorization, async (req, res, next) => {
    const { memberId, status } = req.body;
    const id = memberId;

    try {
        const memberhsip = await Membership.updateMember({ status }, id);

        return res.json(membership);
    }
    catch (e) {
        next(e);
    }
});


//delete member

router.delete('/', requireAuthorization, async(req, res, next) => {
    const {memberId} = req.body;
    try {
        const del = await Membership.deleteMember({id: memberId});

        if (del) {
            return res.json({ message: 'Successfully deleted', statusCode: 200 });
        }
        else {
            const err = new Error('No such Membership Exists');
            err.status = 404;
            throw err;
        }
    }
    catch(e) {
        next(e);
    }
});



module.exports = router;
