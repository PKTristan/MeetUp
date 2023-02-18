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
    static associate(models) {
      // define association here
    }
  }
  GroupImage.init({
    groupId: DataTypes.INTEGER,
    preview: DataTypes.BOOLEAN,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};