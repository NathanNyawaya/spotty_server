import mongoose, { Schema } from "mongoose";

const soccerSchema = new Schema(
    {
        soccerData: { type: Object }
    },
    { timestamps: true }
);

var Soccer = mongoose.model("Soccer", soccerSchema);
export default Soccer;


