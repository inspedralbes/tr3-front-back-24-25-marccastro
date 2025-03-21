import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Item', {
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'items',
    timestamps: false,
  });
};