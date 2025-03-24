import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('PurchaseHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchase_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  }, {
    tableName: 'purchases_history',
    timestamps: false,
  });
};