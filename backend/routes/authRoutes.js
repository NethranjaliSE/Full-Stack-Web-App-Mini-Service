import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (id, name, role) => {
  return jwt.sign(
    { id, name, role },
    process.env.JWT_SECRET || "super_secret_interview_key",
    {
      expiresIn: "1d",
    },
  );
};

//  Registration Endpoint
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill in all input fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    // Creates the user password hashing is handled by the User model's pre-save hook
    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      token: generateToken(user._id, user.name, user.role),
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Server registry processing failed" });
  }
});

//   Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { id: user._id, name: user.name, role: user.role };
    const token = generateToken(user._id, user.name, user.role);

    return res.json({ token, user: payload });
  } catch (error) {
    return res.status(500).json({ message: "Server authentication error" });
  }
});

export default router;
