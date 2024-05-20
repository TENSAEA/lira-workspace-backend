const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password").lean();

  // check if there are users
  if (!user?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json(user);
});

// @desc Create new user
// @route POST /users
// @access Private

const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //Check if all the fields are filled
  if (!username || !password || !Array.isArray(roles) || !roles.length > 0) {
    return res.status(404).json({ message: "All fields are required" });
  }

  //Check if the username already exists
  const duplicate = await User.findOne({ username: username }).lean().exec();

  if (duplicate) {
    return res.status(404).json({ message: "Duplicate Name" });
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
    roles,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  res.status(201).json({ user });
});

// @desc Update user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  const user = await User.findById(id);

  //Check if all the fields are filled
  if (!id || !username) {
    return res.status(404).json({ message: "All fields are required" });
  }

  //Check if the username already exists
  const duplicate = await User.findOne({ username: username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(404).json({ message: "Not have permission" });
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  const updatedUser = await user.save();

  res.status(200).json({ message: `User updated successfully ${updatedUser}` });
});

// @desc Delete user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const note = await Note.findOne({ user: id });

  if (note) {
    return res
      .status(404)
      .json({ message: "The user assigned a note so can't be deleted" });
  }

  const username = user.username;
  await user.deleteOne();
  const reply = `${username} is deleted`;
  res.status(200).json({ message: reply });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
