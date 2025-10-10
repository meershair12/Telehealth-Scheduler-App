const ApiKey = require("../models/apikey.model");


module.exports = async (req, res, next) => {
  try {
    // Expecting the API key in the Authorization header as: Bearer <key>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const apiKeyValue = authHeader.split(" ")[1];

    // Check key in DB
    const apiKey = await ApiKey.findOne({
      where: { keyValue: apiKeyValue, isActive: true },
    });

    if (!apiKey) {
      return res.status(403).json({ error: "Invalid or inactive API key" });
    }

    // Optionally record usage
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // Attach key info for downstream controllers
    req.apiKey = apiKey;
    next();
  } catch (err) {
    console.error("API key validation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

