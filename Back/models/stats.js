import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
    kills: { type: Number, required: true },
    rounds: { type: Number, required: true }
}, {
    timeStamp: true
});

module.exports = mongoose.model('Stats', StatsSchema, 'stat');