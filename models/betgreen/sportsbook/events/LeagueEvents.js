import mongoose, { Schema } from "mongoose";

const leagueEventsSchema = new Schema(
    {
        leagueId: { type: String },
        leagueName: { type: String },
        leagueEventsData: { type: Object }
    },
    { timestamps: true }
);

var LeagueEvents = mongoose.model("LeagueEvents", leagueEventsSchema);
export default LeagueEvents;


