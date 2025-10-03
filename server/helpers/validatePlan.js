import User from "../models/user.model.js";


export const validatePlan = async (userId, model, usingCustomKey = false, dailyFreeLimit = 10000) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const now = new Date();

  // Reset free tokens if expired
  if (!user.tokenResetAt || now > user.tokenResetAt) {
    user.tokensUsedToday = 0;
    user.tokenResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await user.save();
  }

  // Free plan checks
  if (user.plan === "free") {
    if (user.tokensUsedToday >= dailyFreeLimit) {
      throw new Error("Daily free token limit reached");
    }
    if (model !== "llama-3.3-70b-versatile") {
      throw new Error("Upgrade required to access this model");
    }
  }

  // Basic plan checks
  if (user.plan === "basic") {
    if (usingCustomKey) {
      throw new Error("Custom API keys allowed only in Pro plan");
    }
  }

  // Paid plan expiry check
  if ((user.plan === "basic" || user.plan === "pro") && user.planExpiresAt) {
    if (now > user.planExpiresAt) {
      user.plan = "free";
      await user.save();
      throw new Error("Subscription expired. Downgraded to free plan.");
    }
  }

  return user;
};