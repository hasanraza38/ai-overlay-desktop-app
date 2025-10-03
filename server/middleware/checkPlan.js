import User from "../models/user.model.js";

export const checkPlan = (dailyFreeLimit = 10000) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const now = new Date();
      if (!user.tokenResetAt || now > user.tokenResetAt) {
        user.tokensUsedToday = 0;
        user.tokenResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await user.save();
      }

      if (user.plan === "free") {
        if (user.tokensUsedToday >= dailyFreeLimit) {
          return res.status(403).json({ error: "Daily free token limit reached" });
        }
      }

      if ((user.plan === "basic" || user.plan === "pro") && user.planExpiresAt) {
        if (now > user.planExpiresAt) {
          user.plan = "free";
          await user.save();
          return res.status(403).json({ error: "Subscription expired. Downgraded to free plan." });
        }
      }

      req.user.plan = user.plan;
      req.user.tokensUsedToday = user.tokensUsedToday;
      req.user.dailyFreeLimit = dailyFreeLimit;
      next();
    } catch (err) {
      console.error("Plan check error:", err);
      res.status(500).json({ error: "Plan validation failed" });
    }
  };
};
