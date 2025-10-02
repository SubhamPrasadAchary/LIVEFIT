// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===== Models =====
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

const FoodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealType: { type: String, required: true }, // Breakfast, Lunch, Dinner
  name: { type: String, required: true },
  nutrients: {
    calories: { type: Number, default: 0 },
    protein_g: { type: Number, default: 0 },
    carbs_g: { type: Number, default: 0 },
    fats_g: { type: Number, default: 0 }
  },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now }
});
const Food = mongoose.model("Food", FoodSchema);

// ===== Auth Routes =====
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    
    console.log(`✅ New user registered: ${email}`);
    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(400).json({ error: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    console.log(`✅ User logged in: ${email}`);
    res.json({ 
      token, 
      userId: user._id,
      username: user.username 
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(400).json({ error: "Login failed" });
  }
});

// ===== Middleware to protect routes =====
function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1]; // Expect "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// ===== Food Routes =====
app.post("/api/food/add", authMiddleware, async (req, res) => {
  try {
    const { mealType, name, nutrients } = req.body;
    
    if (!mealType || !name) {
      return res.status(400).json({ error: "Meal type and name are required" });
    }
    
    const food = new Food({ 
      userId: req.userId, 
      mealType, 
      name, 
      nutrients 
    });
    
    await food.save();
    console.log(`✅ Food saved: ${name} (${mealType}) for user ${req.userId}`);
    res.json({ message: "Food saved", food });
  } catch (err) {
    console.error("❌ Save food error:", err);
    res.status(400).json({ error: "Failed to save food" });
  }
});

app.get("/api/food/my", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.userId };
    
    // If date is provided, filter by that date
    if (date) {
      query.date = date;
    } else {
      // Default to today
      query.date = new Date().toISOString().split('T')[0];
    }
    
    const foods = await Food.find(query).sort({ createdAt: -1 });
    console.log(`✅ Fetched ${foods.length} foods for user ${req.userId}`);
    res.json(foods);
  } catch (err) {
    console.error("❌ Fetch foods error:", err);
    res.status(400).json({ error: "Failed to fetch foods" });
  }
});

app.delete("/api/food/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findOne({ _id: id, userId: req.userId });
    
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    
    await Food.deleteOne({ _id: id });
    console.log(`✅ Food deleted: ${food.name} for user ${req.userId}`);
    res.json({ message: "Food deleted" });
  } catch (err) {
    console.error("❌ Delete food error:", err);
    res.status(400).json({ error: "Failed to delete food" });
  }
});

// ===== Food Identification Routes (Your existing API) =====
app.use('/api', apiRoutes);

// ===== Serve frontend static files =====
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.MONGO_URI}`);
});