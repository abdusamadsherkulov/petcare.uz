// Import the tools we installed
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Set up the app
const app = express();
app.use(express.json()); // Lets the server read JSON data from requests
app.use(cors({origin: 'https://abdusamadsherkulov.github.io'})); // Allows your GitHub Pages site to connect

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/petcare?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the user structure (like a blueprint)
const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: {type: String, unique: true}, // Unique email to prevent duplicates
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Secret key for JWT (keep this secret in production!)
const JWT_SECRET = 'your-secret-key'; // Change this to something random and long

// Sign-up route
app.post('/signup', async (req, res) => {
  const {name, surname, email, password} = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already exists'});
    }

    // Hash the password (like scrambling it so it’s unreadable)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({name, surname, email, password: hashedPassword});
    await user.save();

    // Create a token (like a digital ID card)
    const token = jwt.sign({id: user._id, email: user.email}, JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .status(201)
      .json({message: 'User created', token, user: {name, surname, email}});
  } catch (error) {
    res.status(500).json({message: 'Error signing up', error});
  }
});

// Login route
app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    // Find the user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'Invalid email or password'});
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid email or password'});
    }

    // Create a token
    const token = jwt.sign({id: user._id, email: user.email}, JWT_SECRET, {
      expiresIn: '1h',
    });

    res
      .status(200)
      .json({
        message: 'Logged in',
        token,
        user: {name: user.name, surname: user.surname, email},
      });
  } catch (error) {
    res.status(500).json({message: 'Error logging in', error});
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//mongodb+srv://petcareAdmin:<db_password>@petcare.gz3e3gl.mongodb.net/?retryWrites=true&w=majority&appName=petcare
