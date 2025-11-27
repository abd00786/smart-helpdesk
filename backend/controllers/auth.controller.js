import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered. Please login or use a different email." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashed, 
      role: role || "user" 
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    // Handle duplicate key error from MongoDB
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered. Please login or use a different email." });
    }
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json(err);
  }
};
