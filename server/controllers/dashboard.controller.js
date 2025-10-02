import User from "../models/user.model.js"; 

export const getUser = async (req, res) => {
  try {

    const { id, userId, _id } = req.user;  

    const user = await User.findById(userId || id || _id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
