const express = require("express");
const router = express.Router();
const stateController = require("../controllers/states.controller");
const { protect } = require("../middlewares/auth");

// CRUD routes
router.post("/create",protect, stateController.addState);        // Add new
router.get("/all", protect,stateController.getAllStates);     // Fetch all
router.get("/:stateCode",protect, stateController.getStateByCode);  // Fetch one
router.put("/:id/update", protect,stateController.updateState);   // Update
router.delete("/:id/delete",protect, stateController.deleteState);// Delete

module.exports = router;
