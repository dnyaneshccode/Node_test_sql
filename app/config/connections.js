const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('employee', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: '3307',
  logging: false,
  pool: { max: 5, min: 0, idle: 10000 },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.log('err');
  });

module.exports = sequelize;
