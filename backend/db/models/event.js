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
                sequelize.literal('(SELECT COUNT(*) FROM Attendances WHERE Attendances.eventId = Event.id AND (Attendances.status = "host" OR Attendances.status = "co-host" OR Attendances.status = "member"))'),
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
    };

    //create a new event
    static async createEvent(eventObj) {
      try {
        const created = await Event.create(eventObj);
        const {id} = created;
        console.log(id)

        const event = await Event.findByPk(id, {
          attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'type',
            'capacity',
            'price',
            'description',
            'startDate',
            'endDate'
          ]
        });

        return event;
      }
      catch(err) {
        throw err;
      }
    };

    //edit an event
    static async editEvent(eventObj, eventId) {
      try {
        const updated = await Event.update(eventObj, {
          where: {
            id: eventId
          }
        });

        if (!updated[0]) {
          throw new Error('update failed');
        }

        const venue = await Event.findByPk(eventId, {
          attributes: [
            'id',
            'groupId',
            'venueId',
            'name',
            'type',
            'capacity',
            'price',
            'description',
            'startDate',
            'endDate'
          ]
        });

        return venue;
      }
      catch(err) {
        throw err;
      }
    };

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
      allowNull: true
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
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
