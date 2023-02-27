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

    //get a list of venues with a list of constraints
    static async getVenuesBy(attrObj) {
      try {
        const venues = await Venue.findAll({
          attributes: [
            'id',
            'groupId',
            'address',
            'city',
            'state',
            ['latitude', 'lat'],
            ['longitude', 'lng']
          ],
          where: attrObj
        });

        if (!venues) {
          throw new Error('No venues found.');
        }

        return venues;
      }
      catch (err) {
        if (err.message === 'No venues found.') {
          err.status = 404;
        }

        throw err;
      }
    }


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
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
