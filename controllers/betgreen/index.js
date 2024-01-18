import dotenv from "dotenv";
import Soccer from "../../models/betgreen/sportsbook/events/Soccer.js";
import { fetchLeagues, fetchMarkets } from "../../services/livestreams/LivestreamHandler.js";
import SoccerLeagues from "../../models/betgreen/sportsbook/events/SoccerLeagues.js";
import LeagueEvents from "../../models/betgreen/sportsbook/events/LeagueEvents.js";

dotenv.config();

export const marketsService = async () => {
    try {
        console.log("Maintainer Fetching Soccer Events");
        const events = await fetchMarkets();
        if (events) {
            await Soccer.deleteMany();
            const newLivestreamData = new Soccer({
                soccerData: events.data,
            });
            await newLivestreamData.save();
            console.log("Maintainer Fetching Soccer Events process finished status ok");
        } else if (events === "rate_limited") {
            console.log("No data in response");
            console.log("Maintainer Fetching Soccer Events process finished: RATE LIMITED");
        }
    } catch (error) {
        console.log(error);
    }
};


export const soccerLeagueService = async () => {
    try {
        console.log("Maintainer Fetching Leagues");
        const events = await fetchLeagues();
        if (events) {
            await SoccerLeagues.deleteMany();
            const newLivestreamData = new SoccerLeagues({
                soccerLeagueData: events.data,
            });
            await newLivestreamData.save();
            console.log("Maintainer Fetching Leagues service finished status ok");
        } else if (events === "rate_limited") {
            console.log("No data in response");
            console.log("Maintainer Fetching Leagues service finished : Rate Limited");
        }
    } catch (error) {
        console.log(error);
    }
};



export const startMaintainer = async () => {
    try {
        await soccerLeagueService()
        await marketsService()
        await processLeagueEvents()

    } catch (error) {
        console.error(error)
    }
}

export const getAllMarkets = async (req, res) => {
    try {
        const data_ = await Soccer.find()
        if (data_.length > 0) {
            console.log("markets fetched")
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


export const getLeaguesEvents = async (req, res) => {
    try {
        console.log("leagues fetching")
        const data_ = await LeagueEvents.find();
        console.log(data_[0])
        if (data_.length > 0) {
            res.status(200).json(data_)
            console.log("leaguesEvents fetched")
        }
    } catch (err) {
        res.status(500).json(err);
    }
};



const processLeagueEvents = async () => {
    try {
        console.log("Processing LeaguesEvents")
        const allLeagues = await SoccerLeagues.find();
        const allEvents = await Soccer.find({}, { "soccerData.events": 1 });

        if (allLeagues.length > 0 && allEvents.length > 0) {
            const events = allEvents[0].soccerData.events;

            const promises = allLeagues[0].soccerLeagueData.leagues.map(async (league) => {
                const leagueEvents_ = events.filter(event => event.league_id === league.id);

                if (leagueEvents_.length > 0) {
                    const newLeagueEventsDoc = {
                        leagueId: league.id,
                        leagueName: league.name,
                        leagueEventsData: leagueEvents_
                    };

                    return newLeagueEventsDoc;
                }
            });

            const leagueEventsDocs = (await Promise.all(promises)).filter(Boolean);

            if (leagueEventsDocs.length > 0) {
                // Use bulk insert for better performance
                await LeagueEvents.insertMany(leagueEventsDocs);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
