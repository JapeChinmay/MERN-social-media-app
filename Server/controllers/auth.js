import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//register//

export const register = async (req, res) => {
  try {
    //req.body//
    console.log(req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    //hashing
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const saveUser = await newUser.save();
    return res.status(201).json(saveUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "User creation failed", error: err });
  }
};

//login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User was not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET);
    delete user.password;

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "error occured", error: err });
  }
};
