const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get All Contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit Contact Form
router.post('/', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.json({ message: 'Contact Saved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;