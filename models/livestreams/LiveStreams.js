import mongoose, { Schema } from "mongoose";

const liveStreamSchema = new Schema(
  {
    live_events_data: { type: Object },
  },
  { timestamps: true }
);

var LiveStream = mongoose.model("LiveStream", liveStreamSchema);
export default LiveStream;
