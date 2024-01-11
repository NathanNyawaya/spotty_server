import mongoose, { Schema } from "mongoose";

const soccerLeaguesSchema = new Schema(
    {
        soccerLeagueData: { type: Object }
    },
    { timestamps: true }
);

var SoccerLeagues = mongoose.model("SoccerLeagues", soccerLeaguesSchema);
export default SoccerLeagues;


