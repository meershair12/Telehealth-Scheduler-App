
// routes/apiKey.routes.js

const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKey.controller");
const {protect} = require("../middlewares/auth")
// Create a new API key
router.post("/generate-key",protect, apiKeyController.createApiKey);

router.post("/regenerate-key/:id",protect, apiKeyController.recreateApiKey);

// Get all API keys
router.get("/all",protect, apiKeyController.getAllKeys);

// Deactivate a specific key
router.patch("/:id/deactivate",protect, apiKeyController.deactivateKey);

router.patch("/:id/activate",protect, apiKeyController.activateKey);

router.delete("/:id/delete",protect, apiKeyController.deleteKey);

module.exports = router;

