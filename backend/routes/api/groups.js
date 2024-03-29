//backend/routes/api/groups.js
const express = require('express');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA; // schema in options
};

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, GroupImage, Membership } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const membersRouter = require('./members.js');

const router = express.Router();

//checks if group exists
const exists = async (req, res, next) => {
    try {
        const group = await Group.findByPk(req.params.groupId);

        if (!group) {
            const err = new Error("Group couldn't be found");
            err.error = "Group couldn't be found";
            err.status = 404;

            throw err;
        }

        next();
    }
    catch (err) {
        throw err;
    }
}

//route to members
router.use('/:groupId/members', exists, membersRouter);

//route to members for memberhsip request
router.use('/:groupId/membership', requireAuthentication, exists, membersRouter)

//get all groups
router.get('/', async (req, res, next) => {
    try {
        const groups = await Group.findAll({
            attributes: {
                include: [
                    // count number of users in group
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM ${(options.schema) ? `"${options.schema}"."Memberships"` : `"Memberships"`
                            } WHERE "Memberships"."groupId" = "Group"."id" GROUP BY "Memberships"."groupId")`
                        ),
                        'numMembers',
                    ],
                    // preview image URL
                    [
                        Sequelize.literal(
                            `(SELECT "url" FROM ${(options.schema) ? `"${options.schema}"."GroupImages"` : `"GroupImages"`
                            } WHERE "GroupImages"."groupId" = "Group"."id" AND "GroupImages"."preview" = true ORDER BY "GroupImages"."id" LIMIT 1)`
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
router.get('/current', requireAuthentication, async (req, res, next) => {
    const { user } = req;

    try {
        const groups = await Group.findAll({
            attributes: {
                include: [
                    // count number of users in group
                    [
                        Sequelize.literal(
                            `(SELECT COUNT(*) FROM ${(options.schema) ? `"${options.schema}"."Memberships"` : `"Memberships"`
                            } WHERE "Memberships"."groupId" = "Group"."id")`
                        ),
                        'numMembers',
                    ],
                    // preview image URL
                    [
                        Sequelize.literal(
                            `(SELECT "url" FROM ${(options.schema) ? `"${options.schema}"."GroupImages"` : `"GroupImages"`
                            } WHERE "GroupImages"."groupId" = "Group"."id" AND "GroupImages"."preview" = true)`
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
                            `SELECT "groupId" FROM${(options.schema) ? `"${options.schema}"."Memberships"` : `"Memberships"`
                            } WHERE "Memberships"."userId" = ${user.id} AND "Memberships"."status" = 'member'`
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
    const { groupId } = req.params;

    try {
        const group = await Group.getById(groupId);


        return res.json(group);
    }
    catch (error) {
        if (error.message === `Group not found.`) {
            const err = new Error(`Group with id ${groupId} not found.`);
            err.status = 404;
            err.title = error.message;
            err.errors = ['The provided group id doe snot exist.'];
            return next(err);
        }
        next(error);
    }
});

//add image to group based on group id
router.post('/:groupId/images', requireAuthentication, exists, requireAuthorization, async (req, res, next) => {
    const { groupId } = req.params;
    const { preview, url } = req.body;

    try {
        const image = await GroupImage.addImage({ groupId, preview, url });

        return res.status(201).json(image);
    }
    catch (err) {
        next(err);
    }
});

//add venue roles


//get venues for group by groupID router
router.use('/:groupId/venues', requireAuthentication, exists, requireAuthorization, venuesRouter);

//route to events
router.use('/:groupId/events', exists, eventsRouter);

///////////////////////////////////

//validateGroup
const validateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 30 })
        .withMessage('About must be 30 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    handleValidationErrors
];

//validate in person or online
const validateType = (typeLow) => {
    if (typeLow === 'online') {
        return 'Online';
    }
    else if (typeLow === 'in person') {
        return 'In Person';
    }

    throw new Error('Type must be Online or In person');
};

//create a group
router.post('/', validateGroup, requireAuthentication, async (req, res, next) => {
    try {
        const organizerId = req.user.id;
        const { name, about, private, city, state } = req.body;
        let { type } = req.body;

        const typeLow = type.toLowerCase();

        type = validateType(typeLow);

        const group = await Group.addGroup({ organizerId, name, about, type, private, city, state });

        const member = await Membership.requestMembership({ userId: organizerId, groupId: group.id, status: 'host' });

        return res.status(201).json({ group, member });
    }
    catch (errors) {
        next(errors);
    }
});


//edit a group
router.put('/:groupId', validateGroup, requireAuthentication, exists, requireAuthorization,
    async (req, res, next) => {
        const { name, about, type, private, city, state } = req.body;
        const temp = { name, about, type, private, city, state };
        let editObj = {};

        for (const prop in temp) {
            if (temp[prop]) {
                editObj[prop] = temp[prop];
            }
        }

        if (editObj.type) {
            const typeLow = editObj.type.toLowerCase();
            editObj.type = validateType(typeLow);
        }

        try {
            const group = await Group.editGroup(editObj, req.params.groupId);

            return res.json(group);
        }
        catch (err) {
            next(err);
        }
    });


//delete a group
router.delete('/:groupId', requireAuthentication, exists, requireAuthorization,
    async (req, res, next) => {
        const { groupId } = req.params;

        try {
            const del = await Group.deleteGroup(groupId);

            if (del) {
                return res.json({ message: 'Successfully deleted', statusCode: 200 });
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
