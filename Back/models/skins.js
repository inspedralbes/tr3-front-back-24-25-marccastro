import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Skin', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true, // Guardaremos la ruta de la imagen
    },
    assetBundlePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'skins',
    timestamps: false,
  });
};