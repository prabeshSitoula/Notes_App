require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./models/user.model");
const Note = require("./models/note.model");
const { authenticateToken } = require("./utilities");

// Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Simple test route
app.get("/", (req, res) => {
  res.json({ data: "Hello Hello" });
});

// Create Account Route
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields are required (fullName, email, password)",
    });
  }

  try {
    // Check if user exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(409)
        .json({ error: true, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid password" });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({
      error: false,
      accessToken,
      email,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

// Add Note Route (Authenticated)
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({
      error: true,
      message: "Title and content are required",
    });
  }

  try {
    // Create a new note
    const note = new Note({
      title,
      content,
      tags: tags || [], // Default to an empty array if no tags are provided
      userId: user.userId, // Get the userId from the JWT token
    });

    // Save the note in the database
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Error while saving note:", error); // Log the error
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Note Route (Authenticated)
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { userId } = req.user; // Get the userId from the token
  const { noteId } = req.params; // Get the noteId from the URL

  // Check if at least one field is provided for the update
  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: "No changes provided",
    });
  }

  try {
    // Find the note by noteId and ensure it belongs to the authenticated user
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found or you do not have permission to edit it",
      });
    }

    // Update the fields if they are provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;

    // Save the updated note
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error while editing note:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get all notes (Authenticated)
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { userId } = req.user; // Get the userId from the token

  try {
    // Fetch all notes that belong to the authenticated user
    const notes = await Note.find({ userId });

    if (!notes.length) {
      return res.status(404).json({
        error: true,
        message: "No notes found for this user",
      });
    }

    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error while fetching notes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get User Profile (Authenticated)
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    // Find the user by ID
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.json({
      error: false,
      user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error while fetching user:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Get All Users (Authenticated)
app.get("/get-all-users", authenticateToken, async (req, res) => {
  try {
    // Find all users, excluding their passwords
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({
        error: true,
        message: "No users found",
      });
    }

    return res.json({
      error: false,
      users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Note Route (Authenticated)
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { noteId } = req.params;

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      return res.status(404).json({
        error: true,
        message: "Note not found or you do not have permission to delete it",
      });
    }

    return res.json({
      error: false,
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (error) {
    console.error("Error while deleting note:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

//Update isPinned Value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { noteId } = req.params;
  const { isPinned } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isPinned },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        error: true,
        message: "Note not found or you do not have permission to update it",
      });
    }

    return res.json({
      error: false,
      message: "Note pin status updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error while updating note pin status:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

//Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { query } = req.query;

  try {
    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    });

    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error while searching notes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
