'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    options.order = 7;
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        preview: true,
        url: "https://picsum.photos/200/300"
      },
      {
        groupId: 1,
        preview: false,
        url: "https://via.placeholder.com/150"
      },
      {
        groupId: 1,
        preview: false,
        url: "https://placeimg.com/640/480/animals"
      },
      {
        groupId: 2,
        preview: true,
        url: "https://source.unsplash.com/500x500/?nature"
      },
      {
        groupId: 2,
        preview: false,
        url: "https://loremflickr.com/320/240"
      },
      {
        groupId: 2,
        preview: false,
        url: "https://www.fillmurray.com/200/300"
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    options.order = 2;
    return queryInterface.bulkDelete(options);
  }
};
