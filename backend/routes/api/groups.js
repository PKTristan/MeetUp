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
        next(error);
    }
});

//validateGroup
const validateGroup = [
    check('name')
        .exists( { checkFalsy: true})
        .withMessage('Please provide a group name'),
    check('about')
        .exists({checkFalsy: true})
        .isLength({min: 60})
        .withMessage('Please provide 60 words about this group.'),
    check('type')
        .exists({checkFalsy: true})
        .withMessage('Please pick Online or In Person.'),
    check('private')
        .exists({checkFalsy: true})
        .withMessage('Please provide true or false'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('Please provide the name of a city'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('Please provide a state name'),
    handleValidationErrors
];

//create a group
router.post('/', validateGroup, async (req, res, next) => {
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

        return res.json({group});
    }
    catch (errors) {
        next(errors);
    }
});

module.exports = router;
