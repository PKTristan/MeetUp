//backend/routes/api/groups.js
const express = require('express');

const { requireAuthentication } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User} = require('../../db/models');
const { Sequelize } = require('sequelize');

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

module.exports = router;
