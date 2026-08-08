const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    predictedDisease: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    precautions: {
        type: [String],
        required: true
    },
    medications: {
        type: [String],
        required: true
    },
    diets: {
        type: [String],
        required: true
    },
    workouts: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
