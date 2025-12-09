const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Get All Subscribers
router.get('/', async (req, res) => {
    try {
        const subs = await Subscriber.find();
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Subscriber
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const newSub = new Subscriber({ email });
        await newSub.save();
        res.json({ message: 'Subscribed Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;