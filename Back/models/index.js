import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST || 'mysql',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexió a la base de dades establerta correctament.');
  } catch (error) {
    console.error('Error en connectar amb la base de dades:', error);
  }
}

import defineUser from './user.js';
import defineSkin from './skins.js';
import definePurchaseHistory from './purchaseHistory.js';

const User = defineUser(sequelize);
const Skin = defineSkin(sequelize);
const PurchaseHistory = definePurchaseHistory(sequelize);

User.hasMany(PurchaseHistory, { foreignKey: 'user_id' });
PurchaseHistory.belongsTo(User, { foreignKey: 'user_id' });

Skin.hasMany(PurchaseHistory, { foreignKey: 'skin_id' });
PurchaseHistory.belongsTo(Skin, { foreignKey: 'skin_id' });

connectDB();

export { sequelize, User, Skin, PurchaseHistory };
export default sequelize;