import LiveStream from "../../models/livestreams/LiveStreams.js";
import { fetchLiveFootball } from "./LivestreamHandler.js";

export const livestreamService = async () => {
  try {
    console.log("Live Stream service started");
    const events = await fetchLiveFootball();
    if (events) {
      await LiveStream.deleteMany();
      const newLivestreamData = new LiveStream({
        live_events_data: events.data,
      });
      await newLivestreamData.save();
      console.log("Live Stream service finished status ok");
    } else if (events === "rate_limited") {
      console.log("No data in response");
      console.log("Live Stream service finished statu !ok");
    }
  } catch (error) {
    console.log(error);
  }
};
