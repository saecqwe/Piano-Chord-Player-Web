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
const Chord = require("./models/chord");

const app = express();
app.use(express.json());

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    },
});

const upload = multer({ storage });

// Serve static files (frontend)
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Make uploaded files accessible

// API routes
app.get("/chords", async (req, res) => {
    try {
        const chords = await Chord.find();
        res.json(chords);
    } catch (err) {
        res.status(500).send("Error fetching chords");
    }
});

app.post("/chords", upload.single("audioFile"), async (req, res) => {
    try {
        const { name, notes } = req.body;
        const audio = req.file ? `/uploads/${req.file.filename}` : null;

        const newChord = new Chord({ name, notes: notes.split(","), audio });
        await newChord.save();

        res.status(201).send("Chord added successfully");
    } catch (err) {
        res.status(400).send("Error adding chord");
    }
});

app.delete("/chords/:id", async (req, res) => {
    try {
        await Chord.findByIdAndDelete(req.params.id);
        res.send("Chord deleted successfully");
    } catch (err) {
        res.status(400).send("Error deleting chord");
    }
});

// Serve admin panel route
app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
