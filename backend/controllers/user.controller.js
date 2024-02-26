import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res, next) => {
  try {
    const loggedInUser = req.user.userId;
    const allUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );

    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};
