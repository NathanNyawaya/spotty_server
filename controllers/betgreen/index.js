import dotenv from "dotenv";
import Soccer from "../../models/betgreen/sportsbook/events/Soccer.js";
import { fetchLeagues, fetchMarkets } from "../../services/livestreams/LivestreamHandler.js";
import SoccerLeagues from "../../models/betgreen/sportsbook/events/SoccerLeagues.js";

dotenv.config();

export const marketsService = async () => {
    try {
        console.log("Sportsbook service started");
        const events = await fetchMarkets();
        if (events) {
            await Soccer.deleteMany();
            const newLivestreamData = new Soccer({
                soccerData: events.data,
            });
            await newLivestreamData.save();
            console.log("Sportsbook service finished status ok");
        } else if (events === "rate_limited") {
            console.log("No data in response");
            console.log("Sportsbook service finished statu !ok");
        }
    } catch (error) {
        console.log(error);
    }
};


export const soccerLeagueService = async () => {
    try {
        console.log("Sportsbook leagues service started");
        const events = await fetchLeagues();
        if (events) {
            await SoccerLeagues.deleteMany();
            const newLivestreamData = new SoccerLeagues({
                soccerLeagueData: events.data,
            });
            await newLivestreamData.save();
            console.log("Sportsbook leagues service finished status ok");
        } else if (events === "rate_limited") {
            console.log("No data in response");
            console.log("Sportsbook leagues service finished statu !ok");
        }
    } catch (error) {
        console.log(error);
    }
};



export const startMaintainer = async () => {
    try {
        await soccerLeagueService()
        await marketsService()
    } catch (error) {
        console.error(error)
    }
}
export const getAllMarkets = async (req, res) => {
    try {
        const data_ = await Soccer.find()
        if (data_.length > 0) {
            console.log("markets fetched")
            // console.log(data_[0].soccerData.events[0])
            res.status(200).json(data_[0].soccerData.events)
        }
    } catch (error) {
        console.error(error)
    }
}


export const getLeagues = async (req, res) => {
    try {
        console.log("leagues fetching")
        const data_ = await SoccerLeagues.find();
        console.log(data_)

        if (data_.length > 0) {
            console.log(data_[0].soccerLeagueData)
            res.status(200).json(data_[0].soccerLeagueData)
            console.log("leagues fetched")
        }
    } catch (err) {
        res.status(500).json(err);
    }
};