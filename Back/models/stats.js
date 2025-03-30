import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema({
    kills: { type: Number, required: true },
    rounds: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    wasModificatedMatch: { type: Boolean, required: false },
    email: { type: String, required: true },
    createdAt: { 
        type: String,
        default: () => new Date().toISOString().split('T')[0]  // ✅ Solo la fecha
    }
});

const Stats = mongoose.model("Stats", StatsSchema, "statistics");

export default Stats;