'use strict';

const { QueryError } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;    // define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.order = 5;
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
          name: 'Events_groupId_fkey',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Venues',
          key: 'id',
          name: 'Events_venueId_fkey',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNUll:false
      },
      type: {
        type: Sequelize.ENUM('Online', 'In Person'),
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      numAttending: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.order = 4;
    // await queryInterface.removeConstraint('Events', 'Events_groupId_fkey', options);
    // await queryInterface.removeConstraint('Events', 'Events_venueId_fkey', options);
    await queryInterface.dropTable('Events', options);
  }
};
