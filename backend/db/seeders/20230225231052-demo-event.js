'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Events';
    options.order = 5;
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Evening Tennis on the Water",
        type: "Tennis",
        startDate: "2022-03-15T18:00:00.000Z",
        endDate: "2022-03-15T20:00:00.000Z",
        numAttending: 10
      },
      {
        groupId: 1,
        venueId: 2,
        name: "Morning Yoga by the Pier",
        type: "Yoga",
        startDate: "2022-03-16T09:00:00.000Z",
        endDate: "2022-03-16T10:00:00.000Z",
        numAttending: 5
      },
      {
        groupId: 2,
        venueId: 3,
        name: "Afternoon Jogging in Central Park",
        type: "Running",
        startDate: "2022-03-17T16:00:00.000Z",
        endDate: "2022-03-17T17:00:00.000Z",
        numAttending: 8
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    options.order = 4;
    return queryInterface.bulkDelete(options);
  }
};
