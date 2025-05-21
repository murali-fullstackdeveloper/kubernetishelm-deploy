import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // for allowing cross-origin requests from frontend to backend server
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ Message: err.message });
  }
});

app.post("/userRegistration", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ Message: err.message });
  }
});

app.get("/read/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    return res.json([user]); // Return as array for consistency with frontend expectations
  } catch (err) {
    return res.status(500).json({ Message: err.message });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedUser) {
      return res.status(404).json({ Message: "User not found" });
    }
    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ Message: err.message });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ Message: "User not found" });
    }
    return res.json({ Message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ Message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});