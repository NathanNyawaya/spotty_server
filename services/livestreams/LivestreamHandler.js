import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const fetchLiveFootball = async () => {
  const options = {
    method: "GET",
    url: "https://football-live-stream-api.p.rapidapi.com/index.php",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
      "X-RapidAPI-Host": "football-live-stream-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      console.log(`Live stream response status:${response.status}`);
      return response;
    }
  } catch (error) {
    console.error(error.response.status);
    return error;
  }
};

export const fetchLinks = async (S_ID) => {
  const options = {
    method: "GET",
    url: "https://football-live-stream-api.p.rapidapi.com/stream.php",
    params: { matchid: `${S_ID}` },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
      "X-RapidAPI-Host": "football-live-stream-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response)
    return response;
  } catch (error) {
    console.error(error);
  }
};



// sports book

export const fetchMarkets = async () => {
  const options = {
    method: 'GET',
    url: 'https://pinnacle-odds.p.rapidapi.com/kit/v1/markets',
    params: {
      sport_id: '1',
      is_have_odds: 'true'
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
      'X-RapidAPI-Host': 'pinnacle-odds.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      console.log(`Markets response status:${response.status}`);
      return response;
    }
  } catch (error) {
    console.error(error.response.status);
    return error;
  }
};


export const fetchLeagues = async () => {
  const options = {
    method: 'GET',
    url: 'https://pinnacle-odds.p.rapidapi.com/kit/v1/leagues',
    params: { sport_id: '1' },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
      'X-RapidAPI-Host': 'pinnacle-odds.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      console.log(`Leagues response status:${response.status}`);
      return response;
    }
  } catch (error) {
    console.error(error.response.status);
    return error;
  }
};
