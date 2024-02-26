import User from "../models/user.model.js";
import bcyptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { fullName, username, password, cPassword, gender } = req.body;
  // https://avatar-placeholder.iran.liara.run/
  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  if (!fullName || !username || !password || !cPassword || !gender)
    return next(errorHandler(400, "The required fields must be filled."));

  if (password != cPassword) {
    return next(errorHandler(400, "Passwords don't match."));
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      return next(errorHandler(400, "Username already exists!"));
    }

    const newUser = new User({
      fullName,
      username,
      password: bcyptjs.hashSync(password, 10),
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    await newUser.save();
    res.status(201).json({
      message: "User has been signed up successfully!",
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const passMatch = bcyptjs.compareSync(password, validUser.password);
    if (!passMatch) return next(errorHandler(401, "Invalid credentials!"));
    // generate JWT token here
    generateTokenAndSetCookie(validUser._id, res);

    const { password: hashedPassword, ...rest } = validUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("Error in login controller", error.message);
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    return res
      .cookie("jwt", "", { maxAge: 0 })
      .status(200)
      .json({ message: "User has been logged out!" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    next(error);
  }
};
