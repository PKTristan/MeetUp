'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [5, Infinity]
        }
      },
      type: {
        type: Sequelize.ENUM('Online', 'In Person'),
        allowNull: false
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
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
    });

    // add foreign key constraint
    await queryInterface.addConstraint('Groups', {
      fields: ['organizerId'],
      type: 'foreign key',
      name: 'Groups_organizerId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // remove foreign key constraint
    await queryInterface.removeConstraint('Groups', 'Groups_organizerId_fkey');

    await queryInterface.dropTable('Groups');
  }
};
