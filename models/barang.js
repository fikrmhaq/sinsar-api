const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Barang = sequelize.define('Barang', {
  Kode_Barang: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Gambar: {
    type: DataTypes.STRING
  },
  Nama_Barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Jenis_Barang: {
    type: DataTypes.STRING
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'Tersedia'
  }
}, {
  timestamps: false
});

module.exports = Barang;