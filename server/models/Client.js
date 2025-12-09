const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: String,
    designation: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Client', ClientSchema);