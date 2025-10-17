const express = require('express');
const sequelize = require('./models');
const Barang = require('./models/barang');
const Peminjaman = require('./models/peminjaman');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DataTypes } = require('sequelize');
const cors = require('cors');
const User = require('./models/user');

const app = express();
app.use(cors()); // ✅ Allow all origins (for dev)
app.use(express.json());
const JWT_SECRET = 'your_super_secret_key'; // ← add this line

// Create table if not exists
sequelize.sync().then(() => console.log('Database synced'));

// Routes


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    console.log('token=',req.headers)
    // if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

app.get('/barang', verifyToken, async (req, res) => {
    const data = await Barang.findAll();
    res.json(data);
});

app.post('/barang', verifyToken, async (req, res) => {
    const item = await Barang.create(req.body);
    res.json(item);
});


app.post('/auth/signin', async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { Username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Simple password check (plaintext comparison)
        if (Password !== user.Password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { Id: user.Id, Username: user.Username, Role: user.Role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                Id: user.Id,
                Nama: user.Nama,
                Username: user.Username,
                Role: user.Role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/barang/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Barang.update(req.body, { where: { id } });

        if (updated) {
            const updatedItem = await Barang.findByPk(id);
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Barang not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/barang/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Barang.destroy({ where: { id } });

        if (deleted) {
            res.json({ message: 'Barang deleted successfully' });
        } else {
            res.status(404).json({ message: 'Barang not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all peminjaman

// GET /peminjaman (with optional query)
app.get('/peminjaman', verifyToken, async (req, res) => {
  try {
    // Copy all query parameters directly as filters
    const filters = { ...req.query };

    // Optionally, convert numeric fields (like Status or Id_Barang)
    // if your model uses integers instead of strings
    if (filters.Status) filters.Status = Number(filters.Status);
    if (filters.Id_Barang) filters.Id_Barang = Number(filters.Id_Barang);

    const data = await Peminjaman.findAll({ where: filters });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST create a new peminjaman
app.post('/peminjaman', verifyToken, async (req, res) => {
    try {
        const { NIM, Id_Barang, Tgl_Pinjam, Tgl_Kembali, Status } = req.body;

        // You can add validation checks here if needed
        const newPeminjaman = await Peminjaman.create({
            NIM,
            Id_Barang,
            Tgl_Pinjam,
            Tgl_Kembali,
            Status  
        });

        res.status(201).json(newPeminjaman);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/peminjaman/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // only update fields sent by client

    // Find the record
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) {
      return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
    }

    // Update only fields provided in the body
    await peminjaman.update(updates);

    res.status(200).json({
      message: "Data peminjaman berhasil diperbarui",
      data: peminjaman
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));