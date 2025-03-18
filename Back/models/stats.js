import mongoose from "mongoose";

const StatsSchema = new mongoose.Schema({
    kills: { type: Number, required: true },
    rounds: { type: Number, required: true }
}, {
    timeStamp: true
});

const Stats = mongoose.model("Stats", StatsSchema, "stat");

export default Stats;  // ✅ Exportación en ES Modules