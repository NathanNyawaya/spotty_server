import axios from "axios";
import EplStandings from "../../models/sports/eplData.js";

const fetchEplData = async () => {
    const options = {
        method: 'GET',
        url: 'https://premier-league-standings1.p.rapidapi.com/',
        headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
            'X-RapidAPI-Host': 'premier-league-standings1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        if (response.status === 200) {
            console.log(`EPL response status:${response.status}`);
            return response;
        }
    } catch (error) {
        console.error(error.response.status);
        return error;
    }
};



export const eplMaintainer = async () => {
    try {
        const res = await fetchEplData()
        if (res && res.data) {
            console.log(res.data)
            if (res.data.length > 0) {
                const standings = res.data
                await EplStandings.deleteMany()
                const newDoc = new EplStandings({
                    eplStandings: standings
                })
                await newDoc.save()
            }
            // delete the already data and add new 
        }
        // await fetchEplStandings()
    } catch (error) {
        console.error(error)
    }
}


export const fetchEplStandings = async (req, res) => {
    try {
        const eplData = await EplStandings.find()
        if (eplData && eplData.length > 0) {
            console.log(eplData[0].eplStandings)
            res.status(200).json(eplData[0].eplStandings)
        }
    } catch (error) {
        // console.error(error)
        res.status(500).json(err);
    }
}