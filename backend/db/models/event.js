'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    //get events by
    static async getEventsBy (whereObj) {
      try {
        const events = await Event.findAll({
          attributes: {
            include: [
              'id',
              'groupId',
              'venueId',
              'name',
              'description',
              'type',
              'capacity',
              'price',
              'startDate',
              'endDate',
              [
                sequelize.literal('(SELECT COUNT(*) FROM Attendances WHERE Attendances.eventId = Event.id AND Attendances.status = "Going")'),
                'numAttending'
              ],
              [
                sequelize.literal(
                  `(SELECT url FROM EventImages WHERE EventImages.eventId = Event.id AND EventImages.preview = true)`
                ),
                'previewImage'
              ]
            ],
            exclude: ['createdAt', 'updatedAt']
          },
          include: [
            {
              model: sequelize.models.Group,
              attributes: ['id', 'name', 'city', 'state']
            },
            {
              model: sequelize.models.Venue,
              attributes: ['id', 'city', 'state']
            }
          ],
          where: whereObj
        });


        return events;
      }
      catch (err) {
        throw err;
      }
    }


    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId'
      });

      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      });

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });

      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      });
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In Person'],
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numAttending: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
