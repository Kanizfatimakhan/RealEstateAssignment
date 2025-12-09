const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const upload = require('../middleware/upload');

// Get All Clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Client
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, designation, description } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
        const newClient = new Client({ name, designation, description, image });
        await newClient.save();
        res.json(newClient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ADD THIS DELETE ROUTE ---
router.delete('/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Client Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;