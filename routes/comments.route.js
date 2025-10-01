const express = require('express');

const  { createComment, deleteComment, getComments, updateComment } = require("../controllers/comment.controller");
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post("/create", protect,createComment);          // Create comment
router.get("/:id/all",protect, getComments);             // Get comments (optionally by reservationId)
router.put("/:id/update", protect,updateComment);        // Update comment
router.delete("/:id/delete", protect,deleteComment);     // Delete comment


module.exports = router;