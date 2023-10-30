import dotenv from "dotenv";
import { fetchLinks } from "../../services/livestreams/LivestreamHandler.js";
import Predictions from "../../models/predictions/Predictions.js";

dotenv.config();

// get all properties
export const getAllPredictions = async (req, res) => {
  try {
    const all_links = await Predictions.find().sort({ createdAt: -1 });
    const livestream_res = all_links.length > 0 ? all_links : "Empty streams";
    res.status(200).json(livestream_res);
  } catch (err) {
    res.status(500).json(err);
  }
};

// // get all properties
// export const getStreamLinks = async (req, res) => {
//   console.log("getting stream links");
//   try {
//     const stream_id = req.params.id;
//     const links = await fetchLinks(stream_id.toString());
//     if (links) {
//       if (links.data.length > 0) {
//       } else {
//         res.status(200).json({message: "No data found"});
//       }
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
