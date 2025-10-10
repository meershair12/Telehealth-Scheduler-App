
// routes/apiKey.routes.js

const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKey.controller");

// Create a new API key
router.post("/generate-key", apiKeyController.createApiKey);
router.post("/regenerate-key/:id", apiKeyController.recreateApiKey);

// Get all API keys
router.get("/all", apiKeyController.getAllKeys);

// Deactivate a specific key
router.patch("/:id/deactivate", apiKeyController.deactivateKey);

router.patch("/:id/activate", apiKeyController.activateKey);

module.exports = router;

