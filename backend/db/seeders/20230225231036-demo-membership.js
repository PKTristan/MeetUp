'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    options.order = 3;
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'approved'
      },
      {
        userId: 2,
        groupId: 1,
        status: 'pending'
      },
      {
        userId: 3,
        groupId: 1,
        status: 'approved'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'approved'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'approved'
      },
      {
        userId: 3,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 1,
        groupId: 3,
        status: 'pending'
      },
      {
        userId: 2,
        groupId: 3,
        status: 'approved'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'approved'
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    options.order = 6;
    return queryInterface.bulkDelete(options);
  }
};
