const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {
    const data = await authService.signup(req.body);
    res.status(201).json(data);
  } catch (err) {
    if (err.message === "USERNAME_EXISTS")
      return res.status(400).json({ message: "Username already taken" });
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS")
      return res.status(401).json({ message: "Invalid username or password" });
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logout(req.body);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
