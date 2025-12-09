const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: String
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);