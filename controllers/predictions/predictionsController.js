import dotenv from "dotenv";
import { fetchLinks } from "../../services/livestreams/LivestreamHandler.js";
import Predictions from "../../models/predictions/Predictions.js";
import BetTip from "../../models/predictions/Tips.js"

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


export const getAllTips = async (req, res) => {
  try {
    const all_tips = await BetTip.find().sort({ createdAt: -1 });
    const betting_tips = all_tips.length > 0 ? all_tips : "Empty tips";
    res.status(200).json(betting_tips);
  } catch (err) {
    res.status(500).json(err);
  }
};



export const getTipOffer = async (req, res) => {
  try {
    const offer_id = req.params.id;
   
    const offer_data = await BetTip.findById(offer_id);
    if (offer_data) {
      console.log(`offer with id ${offer_id} fetched`);
      res.status(200).json({ message: "Offer Document Found", offer_data });
    } else {
      res.status(404).json({ message: "No Offer Document Found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


export const addTip = async (req, res) => {
  try {
    // Extract data from the request body
    const { betOfferName, events, passcode, status, price } = req.body;

    // Create a new bet tip instance
    const newBetTip = new BetTip({
      betOfferName,
      events,
      price,
      passcode,
      status
    });

    // Save the bet tip to the database
    const savedBetTip = await newBetTip.save();

    // Send a success response to the client
    res.status(200).json(savedBetTip);
  } catch (error) {
    console.error('Error adding Bet Tip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Function to edit a BetTip
export const editTip = async (req, res) => {
  try {
    const offer_id = req.params.id;
    const { betOfferName, events, passcode, status, price } = req.body;

    // Find the BetTip by ID and update its fields
    const updatedTip = await BetTip.findByIdAndUpdate(
      offer_id,
      {
        betOfferName,
        events,
        passcode,
        status,
        price
      },
      { new: true }
    );

    if (updatedTip) {
      console.log(`BetTip with id ${offer_id} updated`);
      res.status(200).json({ message: "BetTip Updated", updatedTip });
    } else {
      res.status(404).json({ message: "No BetTip Found for Update" });
    }
  } catch (err) {
    console.error('Error updating BetTip:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a BetTip
export const deleteTip = async (req, res) => {
  try {
    const offer_id = req.params.id;

    // Find the BetTip by ID and remove it
    const deletedTip = await BetTip.findByIdAndRemove(offer_id);

    if (deletedTip) {
      console.log(`BetTip with id ${offer_id} deleted`);
      res.status(200).json({ message: "BetTip Deleted", deletedTip });
    } else {
      res.status(404).json({ message: "No BetTip Found for Deletion" });
    }
  } catch (err) {
    console.error('Error deleting BetTip:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
