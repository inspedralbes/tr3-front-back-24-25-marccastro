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
import defineItem from './item.js'

// Inicializamos los modelos
const User = defineUser(sequelize);
const Item = defineItem(sequelize);

connectDB();

// Exportamos la instancia y los modelos
export { sequelize, User, Item };
export default sequelize;