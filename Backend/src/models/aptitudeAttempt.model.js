const mongoose = require('mongoose');

const aptitudeAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AptitudeQuestion',
        required: true,
        index: true
    },
    selectedOptionIndex: {
        type: Number,
        required: true,
        min: -1,
        max: 3
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

aptitudeAttemptSchema.index({ user: 1, question: 1 });
aptitudeAttemptSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
