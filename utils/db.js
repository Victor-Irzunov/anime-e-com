const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('🚀 🚀 🚀 Успешное соединение с базой данных.');
  })
  .catch((err) => {
    console.error('🚀 🚀 🚀 Ошибка соединения с базой данных:', err);
  });

module.exports = sequelize;

