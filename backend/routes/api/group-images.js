//backend/routes/api/groups.js
const express = require('express');

const { requireAuthentication } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { GroupImage, User } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

const router = express.Router();

router.get('/', async(req, res, next) => {

});


module.exports = router;
