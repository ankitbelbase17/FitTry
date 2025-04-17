require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI , {dbName: "ecommerceDB"}).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

 // Store users temporarily (use a DB like MongoDB in production)

// Register Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received Signup Request:", req.body); 

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("signup error:" , error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        

        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Protected Route Example
app.get("/protected", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        res.json({ message: "Protected data", user: decoded });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
