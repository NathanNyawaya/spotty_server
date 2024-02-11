import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
    {
        eplStandings: { type: Object }
    },
    { timestamps: true }
);

var EplStandings = mongoose.model("EplStandings", dataSchema);
export default EplStandings;


