//backend/routes/api/groups.js
const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group } = require('../../db/models');

const router = express.Router();


//get all groups
router.get('/', async (req, res) => {
   /* const groups = await Group.findAll({
        attributes: {
            include: [
                [
                    Sequelize.literal(
                        '(SELECT COUNT(*) FROM Memberships WHERE Membershipd.groupId = Group.id)'
                    ),
                    'numMembers'
                ]
            ]
        },
        order: [['id', 'ASC']],
        include: GroupImage,
        attributes: ['previewImage']
    });
    */

    const groups = await Group.findAll();

    return res.json(groups);
});

module.exports = router;
