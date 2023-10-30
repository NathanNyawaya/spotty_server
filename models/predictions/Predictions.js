import mongoose, { Schema } from "mongoose";

const predictionSchema = new Schema(
  {
    prediction_data: { type: Object },
    league: { type: String },
  },
  { timestamps: true }
);

var Predictions = mongoose.model("Predictions", predictionSchema);
export default Predictions;
