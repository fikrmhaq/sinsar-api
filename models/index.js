// models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // optional
  dialectOptions: {
    timeout: 5000, // 5 seconds busy timeout
  },
});

// Apply performance settings for SQLite
(async () => {
  await sequelize.query('PRAGMA journal_mode = WAL;');
  await sequelize.query('PRAGMA busy_timeout = 5000;');
})();

module.exports = sequelize;