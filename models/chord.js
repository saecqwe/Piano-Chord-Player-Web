const mongoose = require("../db");

const chordSchema = new mongoose.Schema({
    majorName: String,
    majorNotes: [String],
    details: String,
    minorName: String,
    minorNotes: [String],
    audio: String
});

const Chord = mongoose.model("Chord", chordSchema);

module.exports = Chord;
