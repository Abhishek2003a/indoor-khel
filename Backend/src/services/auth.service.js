const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../utils/token");

const signup = async ({ username, password }) => {
  if (await User.findOne({ username })) throw new Error("USERNAME_EXISTS");
  const hashed = await bcrypt.hash(password, 10);
  await new User({ username, password: hashed }).save();
  return { message: "User registered successfully" };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new Error("INVALID_CREDENTIALS");
  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return { ...tokens, username: user.username };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) return;
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

module.exports = { signup, login, logout };
