const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    memberCode: {
        type: String,
        unique: true
    },
    sponsorCode: {
        type: String,
        required: true
    },
    leftMember: {
        type: String,
        default: null
    },
    rightMember: {
        type: String,
        default: null
    },
    leftCount: {
        type: Number,
        default: 0
    },
    rightCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);