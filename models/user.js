const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // your Sequelize instance

const User = sequelize.define('user', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2 // e.g., 1 = admin, 2 = regular user
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;