'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'startDate', {
      type: Sequelize.DATE
    });

    await queryInterface.changeColumn('Events', 'endDate', {
      type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'startDate', {
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('Events', 'endDate', {
      type: Sequelize.STRING
    });
  }
};
