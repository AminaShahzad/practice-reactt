const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const userRoutes = require("./src/userRoutes.js");
const app = express();
app.use(express.json());
app.use(cors());

// Define MongoDB URI
const MONGO_URI = "mongodb+srv://aminashahzadkhan:amina2004@cluster0.evdyr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create MongoDB client
const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to MongoDB
async function connectDB() {
    try {
         client.connect();
        console.log("✅ Successfully connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
}
connectDB();

// Get database reference
const db = client.db("virtual_telescope");
const telescopesCollection = db.collection("telescopes");
const eyepiecesCollection = db.collection("Eyepieces");
const cameraCollection = db.collection("camera");

// Route to fetch telescopes
app.get("/telescopes", async (req, res) => {
    try {
        const telescopes = await telescopesCollection.find({}).toArray();
        res.json(telescopes);
        console.log(telescopes)
    } catch (err) {
        res.status(500).json({ error: "Error fetching telescopes" });
    }
});

// Route to fetch eyepieces
app.get("/eyepieces", async (req, res) => {
    try {
        const Eyepieces = await eyepiecesCollection.find({}).toArray();
        res.json(Eyepieces);
        console.log(Eyepieces)
    } catch (err) {
        res.status(500).json({ error: "Error fetching eyepieces" });
    }
});
app.get("/cameras", async (req, res) => {
    try {
        const cameras = await cameraCollection.find({}).toArray();
        res.json(cameras);
        console.log(cameras)
    } catch (err) {
        res.status(500).json({ error: "Error fetching Cameras" });
    }
});

app.use("/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
module.exports = { client, telescopesCollection, eyepiecesCollection };