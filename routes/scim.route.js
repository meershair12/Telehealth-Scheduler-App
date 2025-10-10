
const express = require("express");
const router = express.Router();
const scimController = require("../controllers/scim.controller");
const apiKeyAuth = require("../middlewares/apiKeyAuth");

// ✅ Secure with Bearer token (same as in Azure AD Provisioning)

router.use(apiKeyAuth);

router.post("/Users", scimController.createUser);
router.patch("/Users/:id", scimController.updateUser);
router.delete("/Users/:id", scimController.deleteUser);

module.exports = router;

