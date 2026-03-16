const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ======================
// Signup
// ======================
exports.signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      msg: "Signup successful",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ======================
// Login
// ======================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ======================
// Profile (Protected)
// ======================
exports.profile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json({
      msg: "Profile fetched successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ======================
// Update Profile
// ======================
exports.updateProfile = async (req, res) => {
  try {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    res.json({
      msg: "Profile updated",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.profile = async (req,res)=>{
  try{

    const user = await User.findById(req.user.id).select("-password");

    res.json({
      msg:"Profile fetched successfully",
      user
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }
};  