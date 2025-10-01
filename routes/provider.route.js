const express = require("express");
const router = express.Router();
const providerController = require("../controllers/provider.controller");
const { protect } = require("../middlewares/auth");

router.post("/create",protect,  providerController.addProvider);
router.get("/all", protect, providerController.getAllProviders);
// router.get("/all", providerController.getAllProviders);
router.get("/search", protect, providerController.search);
router.get("/:id",protect, providerController.getProviderById);
router.put("/:id/update",protect, providerController.updateProvider);
router.delete("/:id/delete",protect, providerController.deleteProvider);

module.exports = router;
