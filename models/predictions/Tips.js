import { Schema, model } from 'mongoose';

// Define the Event schema
const eventSchema = new Schema({
    club_home: { type: String, required: true },
    club_away: { type: String, required: true },
    selection: { type: String, required: true },
    odds: { type: String, required: true },
    kickoff_date: { type: String, required: true },
    kickoff_time: { type: String, required: true },
    scores: { type: String },
    outcome: { type: String },
    

});

// Define the BetTip schema
const betTipSchema = new Schema(
    {
        betOfferName: { type: String, required: true },
        passcode: { type: String },
        status: { type: String },
        price: { type: String },
        events: [eventSchema],
    },
    { timestamps: true }
);

// Create the BetTip model
const BetTip = model('BetTip', betTipSchema);

export default BetTip;
