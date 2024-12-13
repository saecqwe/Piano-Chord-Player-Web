// const express = require("express");
// const app = express();
// const path = require("path");

// const PORT = 3000;

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));

// // Routes
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

// app.get("/chords", (req, res) => {
//     const chords = [
//         {
//             majorName: "C Major",
//             majorNotes: ["C", "E", "G"],
//             details: "No Sharps or Flats",
//             minorName: "A Minor",
//             minorNotes: ["A", "C", "E"],
//             audio: "/sounds/c-major-chord.mp3"
//         },
//         {
//             majorName: "D Major",
//             majorNotes: ["D", "F#", "A"],
//             details: "Key of G Major",
//             minorName: "B Minor",
//             minorNotes: ["B", "D", "F#"],
//             audio: "/sounds/c-major-chord.mp3"
//         },
//         {
//             majorName: "E Major",
//             majorNotes: ["E", "G#", "B"],
//             details: "Key of A Major",
//             minorName: "C# Minor",
//             minorNotes: ["C#", "E", "G#"],
//             audio: "/sounds/c-major-chord.mp3"
//         },
//         {
//             majorName: "F Major",
//             majorNotes: ["F", "A", "C"],
//             details: "No Sharps or Flats",
//             minorName: "D Minor",
//             minorNotes: ["D", "F", "A"],
//             audio: "/sounds/c-major-chord.mp3"
//         }
//     ];
//     res.json(chords);
// });

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Chord = require("./models/chord");

const app = express();

// Configure multer for file uploads
const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "audio/mpeg") cb(null, true);
        else cb(new Error("Only MP3 files are allowed"));
    },
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Get all chords
app.get("/chords", async (req, res) => {
    try {
        const chords = await Chord.find();
        res.json(chords);
    } catch (err) {
        res.status(500).send("Error fetching chords");
    }
});

// Add a new chord
app.post("/chords", upload.single("audio"), async (req, res) => {
    try {
        const { majorName, majorNotes, details, minorName, minorNotes } = req.body;
        const originalPath = req.file.path;
        const newFileName = `${req.file.filename}.mp3`;
        const newPath = path.join(req.file.destination, newFileName);

        // Rename the file to include the .mp3 extension
        fs.renameSync(originalPath, newPath);
        const newChord = new Chord({
            majorName,
            majorNotes: majorNotes.split(",").map(note => note.trim()),
            details,
            minorName,
            minorNotes: minorNotes.split(",").map(note => note.trim()),
            audio: `/uploads/${req.file.filename}.mp3`,
        });
        await newChord.save();
        res.status(201).send("Chord added successfully");
    } catch (err) { 
        res.status(400).send("Error adding chord");
    }
});

// Delete a chord
app.delete("/chords/:id", async (req, res) => {
    try {
        const chord = await Chord.findById(req.params.id);
        if (!chord) return res.status(404).send("Chord not found");

        // Delete audio file
        const audioPath = path.join(__dirname, chord.audio);
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

        await chord.deleteOne();

        res.send("Chord deleted successfully");
    } catch (err) {
        res.status(400).send("Error deleting chord");
    }
});

app.get("/admin", (req, res) => {
    console.log("admin path");
    res.sendFile(__dirname + "/public/admin.html");
});

app.use(express.static("public"));


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
