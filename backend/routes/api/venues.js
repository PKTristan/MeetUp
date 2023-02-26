//backend/routes/api/groups.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, GroupImage } = require('../../db/models');
const { Sequelize, Op } = require('sequelize');

const router = express.Router();


module.exports = router;
