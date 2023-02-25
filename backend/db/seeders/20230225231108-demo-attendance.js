'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    options.order = 6;
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        eventId: 1,
        status: 'Going'
      },
      {
        userId: 2,
        eventId: 1,
        status: 'Interested'
      },
      {
        userId: 3,
        eventId: 1,
        status: 'Not Going'
      },
      {
        userId: 2,
        eventId: 2,
        status: 'Going'
      },
      {
        userId: 3,
        eventId: 2,
        status: 'Going'
      },
      {
        userId: 1,
        eventId: 3,
        status: 'Going'
      },
      {
        userId: 3,
        eventId: 3,
        status: 'Not Going'
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    options.order = 3;
    return queryInterface.bulkDelete(options);
  }
};
