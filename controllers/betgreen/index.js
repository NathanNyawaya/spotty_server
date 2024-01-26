import dotenv from "dotenv";
import Soccer from "../../models/betgreen/sportsbook/events/Soccer.js";
import { fetchLeagues, fetchMarkets } from "../../services/livestreams/LivestreamHandler.js";
import SoccerLeagues from "../../models/betgreen/sportsbook/events/SoccerLeagues.js";
import LeagueEvents from "../../models/betgreen/sportsbook/events/LeagueEvents.js";
import cron from "node-cron"

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

        cron.schedule('0 0 * * *', async () => {
            console.log('Running the daily maintenance job');
            await soccerLeagueService()
            await marketsService()
            await processLeagueEvents()
        });
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
                await LeagueEvents.deleteMany()
                // Use bulk insert for better performance
                await LeagueEvents.insertMany(leagueEventsDocs);
                console.log("LeagueEvents processing done")
            }
        }
    } catch (error) {
        console.error(error);
    }
};


function calculateArbitrage(home, draw, away) {
    const odds = { home, draw, away };

    // Calculate implied probabilities
    const probHome = 1 / odds.home;
    const probDraw = 1 / odds.draw;
    const probAway = 1 / odds.away;

    // Calculate total implied probability
    const totalProbability = probHome + probDraw + probAway;

    // Check for arbitrage opportunity
    const arbitrageOpportunity = totalProbability < 1;

    return {
        odds,
        totalProbability: totalProbability.toFixed(2),
        arbitrageOpportunity,
    };
}

export const checkArbitrage = async () => {
    try {
        const data_ = await LeagueEvents.find();
        if (data_.length > 0) {
            data_.forEach(league => {
                if (league.leagueName != "") {
                    const events = league.leagueEventsData
                    events.forEach(event => {
                        if (event.periods.num_0.money_line != null) {
                            const odds = event.periods.num_0.money_line
                            // console.log(odds)

                            // function tp check arbitrage

                            const result = calculateArbitrage(odds.home, odds.draw, odds.away);

                            console.log("Arbitrage Result:", result.totalProbability, result.arbitrageOpportunity);

                            // end
                        }
                    })
                }
            })

        }

    } catch (error) {
        console.log(error)
    }
}