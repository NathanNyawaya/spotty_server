import Predictions from "../../models/predictions/Predictions.js";
import { fetctPredictions } from "./PredictionHandler.js";

export const predictionService = async () => {
  try {
    console.log("Prediction service started");

    const leagues = [
      { leagueName: "EPL", leagueKey: "premuire-league" },
      { leagueName: "LALIGA", leagueKey: "laliga" },
      { leagueName: "BUNDESLIGA", leagueKey: "bundesliga" },
    ];

    const predictionPromises = leagues.map(async (league) => {
      const predictionData = await fetctPredictions(league.leagueKey);
      await Predictions.deleteMany();
      const newPredictions = new Predictions({
        prediction_data: predictionData.data,
        league: league.leagueName,
      });
      await newPredictions.save();
    });

    await Promise.all(predictionPromises);

    console.log("Prediction service finished");
  } catch (error) {
    console.log(error);
  }
};
