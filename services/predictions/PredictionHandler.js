import axios from "axios";

export const fetctPredictions = async (league) => {
  const options = {
    method: "GET",
    url: `https://football_api12.p.rapidapi.com/betting/${league}`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_FREE_KEY,
      "X-RapidAPI-Host": "football_api12.p.rapidapi.com",
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
