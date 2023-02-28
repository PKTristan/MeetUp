'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    //get the attendees
    static async getAttendeesBy(whereObj) {
      try {
        const attendees = await Attendance.findAll({
          where: whereObj,
          include: {
            model: sequelize.models.User,
            attributes: ['id', 'firstName', 'lastName'],
          }
        });

        const formatAttendees = attendees.map(attendee => ({
          id: attendee.User.id,
          firstName: attendee.User.firstName,
          lastName: attendee.User.lastName,
          Attendance: {
            status: attendee.status
          }
        }));

        return {Attendees: formatAttendees};

      }
      catch(e) {
        throw e;
      }
    }

    //request an attendance
    static async requestAttendance(reqObj) {
      try {
        const created = await Attendance.create(reqObj);
        const {id} = created;

        const att = await Attendance.findAll({
          attributes: ['userId', 'status'],
          where: reqObj
        });

        return att;
      }
      catch(e) {
        throw e;
      }
    }

    //update an attendee
    static async updateAttendee(upObj) {
      try {
        const updated = await Attendance.update(upObj, {
          where: {
            userId: upObj.userId,
            eventId: upObj.eventId
          }
        });

        if (!updated[0]) {
          throw new Error('update failed');
        }

        const attendee = await Attendance.findAll({
          attributes: ['userId', 'status'],
          where: upObj
        });



        return attendee;
      }
      catch (e) {
        throw e;
      }
    }


    static associate(models) {
      Attendance.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Attendance.belongsTo(models.Event, {
        foreignKey: 'eventId'
      });
    }
  }
  Attendance.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['member', 'waitlist', 'pending', 'host', 'co-host'],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
