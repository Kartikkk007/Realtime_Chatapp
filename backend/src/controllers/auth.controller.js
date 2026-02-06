import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    // generate JWT & set cookie (or response)
    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic

    });

  } catch (error) {
    console.log("error in signup controller:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
 try {
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message : "Invalid credentials"});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message : "Invalid credentials"});
    }

    generateToken(user._id, res);

    return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
    });

 } catch (error) {
    console.log("error in login controller::",error.message);
    return res.status(500).json({message:"Internal Server error"});
 }};

export const logout = (req, res) => {

  try {
    res.cookie("jwt", "", {maxAge:0});
    return res.status(200).json({message:"logged out successfully"});
    
  } catch (error) {
    console.log("error in logout controller::",error.message);
    return res.status(500).json({message:"Internal Server error"});
    
  }
  
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;   // ✅ FIXED

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("error in updateProfile controller::", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};


export const checkAuth = async(req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller::",error.message);
    return res.status(500).json({message:"Internal Server error"});
  }
};

