import User from "../models/UserModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import generateToken from "../Utils/generateToken.js";
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios'

















export const signup = async (req, res) => {

  console.log("data is ", req.body);
  // console.log(req.body)

  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "all felds are required",
      });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 charcaters long " });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "email already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newuser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newuser) {
      const authtoken = generateToken(newuser._id, res);
      await newuser.save();
      res.status(201).json({
        _id: newuser._id,
        fullName: newuser.fullName,
        email: newuser.email,
        authtoken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};














export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("email does not exist");
      return res.status(400).json({ message: "invalid credentials " });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid credentials " });
    }

    const authtoken = generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      authtoken,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};















export const googleAuth=async(req,res)=>{
  const client=new OAuth2Client(
    process.env.client_id,
    process.env.client_secret,
    process.env.redirect_uris
  );
  const code=req.body.code;
  console.log(process.env.redirect_uris)
  if(!code){
   return res.status(400).json({message:"authrization code is required"});
  }

  try {
    
    const {tokens}=await client.getToken(code);
    client.setCredentials(tokens);
    const userRes=await axios.get( `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`)
    // console.log(userRes)
    const {email,name}=userRes.data;
    let user=await User.findOne({email});
    if(!user){
      user=await User.create({
        fullName:name,
        email
      })
    }

    const token =generateToken(user._id,res);
    res.status(200).json({
      message:'login successful',
      token,
      user
    })

  } catch (error) {
    console.log('google auth error ',error.message)
    res.status(500).json({
      message:"Google Authentication Failed",
      error:error.message
    })
  }
}








export const googleDirect = async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ message: "Missing email or name" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ fullName, email });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


