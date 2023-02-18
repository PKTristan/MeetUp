'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId'
      });

      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }
  Venue.init({
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(9, 6),
    longitude: DataTypes.DECIMAL(9, 6),
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
