import dotenv from "dotenv";
import LiveStream from "../../models/livestreams/LiveStreams.js";
import { fetchLinks } from "../../services/livestreams/LivestreamHandler.js";

dotenv.config();

// get all properties
export const getAllLiveStreamsLinks = async (req, res) => {
  try {
    const all_links = await LiveStream.find().sort({ createdAt: -1 });
    const livestream_res = all_links.length > 0 ? all_links : "Empty streams";
    res.status(200).json(livestream_res);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get event link
export const getStreamLinks = async (req, res) => {
  console.log("getting stream links_");
  try {
    const stream_id = req.params.id;
    const links_ = await fetchLinks(stream_id);

    if (links_.status === 200) {
      console.log("sending now.........");
      console.log(links_);
      res.status(200).json(links_);
    } else {
      // res.status(200).json({ message: "No data found" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json(error);
  }
};
