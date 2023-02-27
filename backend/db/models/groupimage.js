'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async addImage(imgObj) {
      try {
        const image = await GroupImage.create(imgObj);

        const img = await GroupImage.findByPk(image.id, {
          attributes: {
            exclude: ['groupId', 'createdAt', 'updatedAt']
          }
        });

        return img;
      }
      catch (err){
        throw err;
      }
    }

    static associate(models) {
      GroupImage.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }
  GroupImage.init({
    groupId: {
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
    modelName: 'GroupImage',
  });
  return GroupImage;
};
