'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    //get memebrs
    static async getMembersBy(whereObj) {
      try {
        const members = await Membership.findAll({
          where: whereObj,
          include: {
            model: sequelize.models.User,
            attributes:['id', 'firstName', 'lastName'],
          }
        });

        const formatMembers = members.map(member => ({
          id: member.User.id,
          firstName: member.User.firstName,
          lastName: member.User.lastName,
          Membership: {
            status: member.status
          }
        }));

        return {Members: formatMembers};
      }
      catch (e) {
        throw e;
      }
    }

    //request membership
    static async requestMembership(memObj) {
      console.log(memObj)
      try {
        const created = await Membership.create(memObj);
        const {id} = created;

        const member = await Membership.findAll({
          attributes: [['id', 'memberId'], 'status'],
          where: memObj
        });

        return member;
      }
      catch(e) {
        throw e;
      }
    }

    //update a memebrship
    static async updateMember(memObj, id) {
      try {
        const updated = await Membership.update(memObj, {
          where: { id }
        });

        if (!updated[0]) {
          throw new Error('update failed');
        }

        const member = await Membership.findByPk(id, {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        });


        return member;
      }
      catch(e) {
        throw e;
      }
    }

    static associate(models) {
      Membership.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'member', 'denied', 'co-host', 'host'],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
