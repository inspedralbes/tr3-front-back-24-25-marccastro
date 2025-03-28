import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Creación de la instancia de Sequelize con manejo de errores
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
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

// Importamos los modelos
import defineUser from './user.js';
import defineSkin from './skins.js';
import definePurchaseHistory from './purchaseHistory.js';

// Inicializamos los modelos
const User = defineUser(sequelize);
const Skin = defineSkin(sequelize);
const PurchaseHistory = definePurchaseHistory(sequelize);

// Asociaciones
User.hasMany(PurchaseHistory, { foreignKey: 'user_id' });
PurchaseHistory.belongsTo(User, { foreignKey: 'user_id' });

Skin.hasMany(PurchaseHistory, { foreignKey: 'skin_id' });
PurchaseHistory.belongsTo(Skin, { foreignKey: 'skin_id' });

connectDB();

// Exportamos la instancia y los modelos
export { sequelize, User, Skin, PurchaseHistory };
export default sequelize;