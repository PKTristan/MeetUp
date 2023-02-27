'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async addImage(imgObj) {
      try {
        const created = await EventImage.create(imgObj);
        const {id} = created;

        const image = await EventImage.findByPk(id, {
          attributes: ['id', 'url', 'preview']
        });

        return image;
      }
      catch(e) {
        throw e;
      }
    };


    static associate(models) {
      EventImage.belongsTo(models.Event, {
        foreignKey: 'eventId'
      });
    }
  }
  EventImage.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
