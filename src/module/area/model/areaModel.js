const { Model, DataTypes } = require('sequelize');

module.exports = class AreaModel extends Model {
  static setup(sequelizeInstance) {
    AreaModel.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      modelName: 'Area',
      paranoid: true,
    });
    return AreaModel;
  }
};
