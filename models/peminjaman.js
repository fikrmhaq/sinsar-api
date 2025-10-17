const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // your Sequelize instance

const Peminjaman = sequelize.define('peminjaman', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  NIM: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Id_Barang: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Tgl_Pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Tgl_Kembali: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'peminjaman',
  timestamps: false
});

module.exports = Peminjaman;