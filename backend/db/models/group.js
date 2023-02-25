'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static async addGroup(groupObj) {
      try {
        const group = await Group.create(groupObj);
        return group;
      }
      catch(e) {
        throw e;
      }
    }



    static associate(models) {
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      });

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId'
      });

      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      });

      Group.hasOne(models.Venue, {
        foreignKey: 'groupId'
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNUll: false,
      validate: {
        len: [60, Infinity]
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In Person']
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
