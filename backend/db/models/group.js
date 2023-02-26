'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    //adds a group to the table
    static async addGroup(groupObj) {
      try {
        const group = await Group.create(groupObj);
        return group;
      }
      catch (e) {
        throw e;
      }
    }

    //gets the details of a user by id
    static async getById(id) {
      try {
        // console.log(`SQL query: ${Group.findByPk.toString()}`);

        const group = await Group.findByPk(id, {
          attributes: {
            include: [
              [
                sequelize.literal(`(SELECT COUNT(*) FROM "Memberships" WHERE "Memberships"."groupId" = ${id} AND "Memberships"."status" = 'approved')`),
                'numMembers'
              ]
            ]
          },
          include: [
            {
              model: sequelize.models.GroupImage,
              attributes: ['id', 'url', 'preview'],
              where: { groupId: id },
              required: false
            },
            {
              model: sequelize.models.User,
              as: 'Organizer',
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: sequelize.models.Venue,
              attributes: ['id', 'groupId', 'address', 'city', ['latitude', 'lat'], ['longitude', 'lng']],
              where: {groupId: id},
              required: false
            }
          ]

        });

        if(!group) {
          throw new Error(`Group not found.`);
        }

        // console.log(group)
        return group;
      }
      catch (e) {
        throw e;
      }
    };

    //edits a group
    static async editGroup(editObj, groupId) {
      try {
        await Group.update(editObj, {
          where: {
            id: groupId
          }
        });

        const group = await Group.findByPk(groupId);

        console.log(group);
        return group;
      }
      catch (err) {
        throw err;
      }
    };


    static associate(models) {
      Group.belongsTo(models.User, {
        as: 'Organizer',
        foreignKey: 'organizerId'
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      });

      Group.belongsToMany(models.User, {
        as: 'member',
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
