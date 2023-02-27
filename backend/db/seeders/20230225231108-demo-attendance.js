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
        status: 'host'
      },
      {
        userId: 2,
        eventId: 1,
        status: 'co-host'
      },
      {
        userId: 3,
        eventId: 1,
        status: 'member'
      },
      {
        userId: 2,
        eventId: 2,
        status: 'host'
      },
      {
        userId: 3,
        eventId: 2,
        status: 'waitlist'
      },
      {
        userId: 1,
        eventId: 3,
        status: 'member'
      },
      {
        userId: 3,
        eventId: 3,
        status: 'member'
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    options.order = 3;
    return queryInterface.bulkDelete(options);
  }
};
