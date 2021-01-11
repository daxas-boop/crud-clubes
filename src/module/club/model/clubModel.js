const { Model, DataTypes } = require('sequelize');

module.exports = class ClubModel extends Model {
  static setup(sequelizeInstance) {
    ClubModel.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tla: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      crestUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      founded: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clubColors: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      venue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      paranoid: true,
      underscored: true,
      modelName: 'Club',
    });
    return ClubModel;
  }

  static setupAssosiations(AreaModel) {
    ClubModel.belongsTo(AreaModel, { foreignKey: 'area_id' });
  }
};
