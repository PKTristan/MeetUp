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
    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId'
      });

      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      });
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.ENUM,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    numAttending: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
