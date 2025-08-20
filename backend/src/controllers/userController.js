const User = require("../models/user");

exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      delete updates.password; 
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password"); 

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); 
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User permanently deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive) filter.isActive = isActive === "true";

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
