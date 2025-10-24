const express = require("express");
const router = express.Router();
const settingController = require("../controllers/setting.controller");

// Base URL: /api/settings

// ✅ Get user settings
router.get("/:userId", settingController.getSettings);

// ✅ Create or update user settings
router.post("/:userId/update", settingController.saveSettings);

// ✅ Reset settings to defaults
router.put("/:userId/reset", settingController.resetSettings);

module.exports = router;
