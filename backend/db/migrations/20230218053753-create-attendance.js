'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;    // define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.order = 6;
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          name: 'Attendance_userId_fkey',
          rules: {
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        },
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id',
          name: 'Attendance_eventId_fkey',
          rules: {
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
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
    options.order = 3;
    // await queryInterface.removeConstraint('Attendances', 'Attendances_userId_fkey', options);
    // await queryInterface.removeConstraint('Attendances', 'Attendance_eventId_fkey', options);
    await queryInterface.dropTable('Attendances', options);
  }
};
