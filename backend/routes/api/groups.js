//backend/routes/api/groups.js
const express = require('express');

const { requireAuthentication } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User} = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

const router = express.Router();


//get all groups
router.get('/', async (req, res, next) => {
    try {
        const groups = await Group.findAll({
            attributes: {
                include: [
                    // count number of users in group
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM "Memberships" WHERE "Memberships"."groupId" = "Group"."id")`
                        ),
                        'numMembers',
                    ],
                    // preview image URL
                    [
                        Sequelize.literal(
                            `(SELECT "url" FROM "GroupImages" WHERE "GroupImages"."groupId" = "Group"."id" AND "GroupImages"."preview" = true)`
                        ),
                        'previewImage',
                    ]
                ]
            }
        });

        return res.json({ Groups: groups });
    }
    catch (error) {
        next(error);
    }
});

//get all groups organized or joined by current user
router.get('/current', requireAuthentication, async(req, res, next) => {
    const { user } = req;

    try {
        const groups = await Group.findAll({
            attributes: {
                include: [
                    // count number of users in group
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM "Memberships" WHERE "Memberships"."groupId" = "Group"."id")`
                        ),
                        'numMembers',
                    ],
                    // preview image URL
                    [
                        Sequelize.literal(
                            `(SELECT "url" FROM "GroupImages" WHERE "GroupImages"."groupId" = "Group"."id" AND "GroupImages"."preview" = true)`
                        ),
                        'previewImage',
                    ]
                ]
            },
            where: {
                [Op.or]: {
                    organizerId: user.id,
                    id: [
                        Sequelize.literal(
                            `SELECT "groupId" FROM "Memberships" WHERE "Memberships"."userId" = ${user.id} AND "Memberships"."status" = "approved"`
                        )
                    ]
                }
            }
        });

        //if (groups)

        return res.json({ Groups: groups });
    }
    catch (error) {
        next(error);
    }
});

//get group details by id
router.get('/:groupId', async (req, res, next) => {
    const {groupId} = req.params;

    try{
        const group = await Group.getById(groupId);

        // console.log(group)
        return res.json(group);
    }
    catch (error) {
        if (error.message === `Group not found.`)
        {
            const err = new Error(`Group with id ${groupId} not found.`);
            err.status = 404;
            err.title = error.message;
            err.errors = ['The provided group id doe snot exist.'];
            return next(err);
        }
    }
});

//validateGroup
const validateGroup = [
    check('name')
        .exists( { checkFalsy: true})
        .isLength({max: 60})
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({checkFalsy: true})
        .isLength({min: 50})
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({checkFalsy: true})
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({checkFalsy: true})
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors
];

//create a group
router.post('/', validateGroup, requireAuthentication, async (req, res, next) => {
    try {
        const organizerId = req.user.id;
        const { name, about, private, city, state} = req.body;
        let {type} = req.body;

        const typeLow = type.toLowerCase();
        if (typeLow === 'online') {
            type = 'Online';
        }
        else if (typeLow === 'in person') {
            type = 'In Person';
        }

        const group = await Group.addGroup({ organizerId, name, about, type, private, city, state });

        return res.status(201).json({group});
    }
    catch (errors) {
        next(errors);
    }
});

module.exports = router;
