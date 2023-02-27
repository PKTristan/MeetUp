'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    options.order = 8;
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        preview: true,
        url: 'https://www.fillmurray.com/200/300'
      },
      {
        eventId: 1,
        preview: false,
        url: 'https://baconmockup.com/300/200/'
      },
      {
        eventId: 2,
        preview: true,
        url: 'https://loremflickr.com/320/240'
      },
      {
        eventId: 3,
        preview: true,
        url: 'https://placeimg.com/640/480/animals'
      },
      {
        eventId: 3,
        preview: true,
        url: 'https://via.placeholder.com/150'
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    options.order = 1;
    return queryInterface.bulkDelete(options);
  }
};
