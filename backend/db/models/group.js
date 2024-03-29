'use strict';
const {
  Model
} = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

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

    //gets the details of a group by id
    static async getById(id) {
      try {

        const group = await Group.findByPk(id, {
          attributes: {
            include: [
              [
                sequelize.literal(`(SELECT COUNT(*) FROM ${
                  (options.schema) ? `"${options.schema}"."Memberships"` : `"Memberships"`
                } WHERE "Memberships"."groupId" = ${id} AND ("Memberships"."status" = 'member' OR "Memberships"."status" = 'co-host' OR "Memberships"."status" = 'host'))`),
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

        return group;
      }
      catch (err) {
        throw err;
      }
    };

    //deletes a group
    static async deleteGroup(groupId) {
      try {
        return await Group.destroy({where: {
          id: groupId
        }});
      }
      catch (err) {
        throw err;
      }
    }

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
