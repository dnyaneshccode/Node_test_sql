const Sequelize = require('sequelize');
const connection = require('../config/connections');
const Users = connection.define('User', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4, // Or DataTypes.UUIDV1
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  gender: {
    type: Sequelize.ENUM,
    values: ['male', 'female'],
  },
  address: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  phone: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  cpassword: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
  },

});

Users.sync({ alter: true }).then(() => {
  console.log('table created');
});
module.exports = Users;
