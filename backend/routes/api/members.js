//backend/routes/api/events.js
const express = require('express');

const { requireAuthentication, requireAuthorization } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Membership } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router({ mergeParams: true });




module.exports = router;
