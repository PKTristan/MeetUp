'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    options.order = 4;
    return queryInterface.bulkInsert(options, [
      {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        latitude: 40.7128,
        longitude: -74.006,
        groupId: 1
      },
      {
        address: '456 Main St',
        city: 'New York',
        state: 'NY',
        latitude: 40.7128,
        longitude: -74.006,
        groupId: 2
      },
      {
        address: '789 Main St',
        city: 'Brooklyn',
        state: 'NY',
        latitude: 40.6782,
        longitude: -73.9442,
        groupId: 3
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    options.order = 5;
    return queryInterface.bulkDelete(options);
  }
};
