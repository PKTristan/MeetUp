'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    options.order = 2;
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Evening Tennis on the Water",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In Person",
        private: true,
        city: "New York",
        state: "NY"
      },
      {
        organizerId: 2,
        name: "Evening Tennis on the Water 2",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In Person",
        private: true,
        city: "New York",
        state: "NY"
      },
      {
        organizerId: 2,
        name: "Evening Tennis on the Water 3",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In Person",
        private: true,
        city: "New York",
        state: "NY"
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    options.order = 7;
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
  }
};
