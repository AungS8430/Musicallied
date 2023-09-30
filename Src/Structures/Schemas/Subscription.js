const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    guild: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);