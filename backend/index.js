const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://adityagahukar:evotingsystem@cluster0.kpjki.mongodb.net/votingSystem"
  )
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const Votingadmin = mongoose.model("Votingadmin", adminSchema);

// Candidate Schema
const candidateSchema = new mongoose.Schema({
  name: String,
  photo: String,
  partyName: String,
  logo: String,
  voteCount: {
    type: Number,
    default: 0
  },
  description: String,
});

const Candidate = mongoose.model("candidates", candidateSchema);

// Express App Setup
const app = express();



// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://localhost:5173",
      "https://127.0.0.1:5173",
      "https://e-voting-platform-f.onrender.com"
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message 
  });
};

// API Routes

// Register Voter
app.post("/api/register-voter", async (req, res, next) => {
  try {
    const { commonName, email } = req.body;

    if (!commonName || !email) {
      return res.status(400).json({ error: "commonName and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User({
      username: commonName,
      email,
      hasVoted: false,
    });

    await newUser.save();
    res.status(200).json({ message: "Voter registered successfully" });
  } catch (error) {
    next(error);
  }
});

// Register Admin
app.post("/api/register-admin", async (req, res, next) => {
  try {
    const { commonName, email } = req.body;

    if (!commonName || !email) {
      return res.status(400).json({ error: "commonName and email are required" });
    }

    // Define the allowed admin emails
    const ADMIN_EMAILS = ["admin@evoting.com", "root@evoting.com"];

    if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ error: "Unauthorized Admin Registration" });
    }

    // Allow multiple registrations for the special admin emails
    let newAdmin;
    if (ADMIN_EMAILS.includes(email)) {
      // Check if the admin with the same email and commonName already exists
      newAdmin = new Votingadmin({
        username: commonName,
        email,
      });
    } else {
      // Check if the admin is already registered (for non-allowed admin emails)
      const existingAdmin = await Votingadmin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already registered" });
      }
      newAdmin = new Votingadmin({
        username: commonName,
        email,
      });
    }

    await newAdmin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    next(error);
  }
});


// Get All Candidates
app.get("/api/candidates", async (req, res, next) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

// Get Single Candidate
app.get("/api/candidates/:id", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    next(error);
  }
});

// Add Candidate (Admin Only)
app.post("/api/candidates", async (req, res, next) => {
  try {
    const { name, photo, partyName, logo, description } = req.body;
    
    const newCandidate = new Candidate({
      name,
      photo,
      partyName,
      logo,
      voteCount: 0,
      description,
    });

    await newCandidate.save();
    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    next(error);
  }
});

// Get All Users
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Cast Vote
app.post("/api/vote", async (req, res, next) => {
  try {
    const { email, candidateId } = req.body;

    if (!email || !candidateId) {
      return res.status(400).json({ error: "Email and candidateId are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.voteCount += 1;
    user.hasVoted = true;

    await Promise.all([candidate.save(), user.save()]);
    res.json({ message: "Vote cast successfully" });
  } catch (error) {
    next(error);
  }
});

// Get Voting Results
app.get("/api/results", async (req, res, next) => {
  try {
    const results = await Candidate.find().select('name partyName voteCount');
    const totalVotes = results.reduce((sum, candidate) => sum + candidate.voteCount, 0);
    
    const resultsWithPercentage = results.map(candidate => ({
      name: candidate.name,
      partyName: candidate.partyName,
      voteCount: candidate.voteCount,
      percentage: totalVotes ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : 0
    }));

    res.json({
      totalVotes,
      candidates: resultsWithPercentage
    });
  } catch (error) {
    next(error);
  }
});

// Use error handler middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5001;

// Also listen on HTTP for development
app.listen(PORT , () => {
  console.log(`HTTP Server running on port ${PORT }`);
});

module.exports = { app, User, Votingadmin, Candidate };