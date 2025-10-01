// controllers/reservationCommentController.js
const ReservationComment = require("../models/comments.model.js");
const User = require("../models/user.model.js");
const{ getFullForm } = require("./privilliges.controller.js");

// ✅ Create a new comment
 const createComment = async (req, res) => {
  try {
    const { reservationId, content: comment, type, parentCommentId } = req.body;


    const newComment = await ReservationComment.create({
      reservationId,
      userId: req.user.id,
      comment,
      type: type || "main",
      parentCommentId: parentCommentId || null,
    });

    return res.status(201).json({
      status: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ✅ Get all comments (optionally by reservationId)
 const getComments = async (req, res) => {
  try {
    const { id: reservationId } = req.params;

    const whereClause = reservationId ? { reservationId } : {};
    const commentsRaw = await ReservationComment.findAll({
      where: whereClause,
      order: [
  ["createdAt", "DESC"],
  ["id", "DESC"]
]
,
      include: [
        {
          model: User,
          as: "author",
          attributes: [
            "firstName",
            "lastName",
            "privilege",
            "email",
            "profile",
            "status",
            "id"
          ],
        },
      ],
    });



    if (!commentsRaw.length) {
      return res.status(200).json({
        status: true,
        message: "No comments found",
      });
    }
    const comments = buildComments(commentsRaw);

    return res.status(200).json(comments
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ✅ Update comment
 const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existing = await ReservationComment.findByPk(id);
    if (!existing) {
      return res.status(404).json({ status: false, message: "Comment not found" });
    }

    await existing.update({ comment });

    return res.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

// ✅ Delete comment
 const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await ReservationComment.findByPk(id);
    if (!existing) {
      return res.status(404).json({ status: false, message: "Comment not found" });
    }

    await existing.destroy();

    return res.status(200).json({
      status: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};




// Convert flat → nested
function buildComments(comments) {
  const map = {};
  const roots = [];



comments.forEach((comment) => {
  const formatted = {
    id: comment.id.toString(),
    content: comment.comment,
    author: {
      name: comment.author.firstName + " " + comment.author.lastName,
      profile: comment.author.profile,
      role: getFullForm(comment.author.privilege),
      id:comment.author.id,
      status: comment.author.status,
      message:
        comment.author.status == "inactive"
          ? inactiveMessages[Math.floor(Math.random() * inactiveMessages.length)]
          : null,
      email: comment.author.email,
      initials:
        comment.author.firstName.charAt(0) +
        comment.author.lastName.charAt(0),
    },
    isEdit: new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime(),
    timestamp: new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime() ? comment.updatedAt :comment.createdAt,
    replies: [],
    parentId: comment.parentId || null,
  };

  map[formatted.id] = formatted;

  if (formatted.parentId && map[formatted.parentId]) {
    map[formatted.parentId].replies.push(formatted);
  } else if (!formatted.parentId) {
    roots.push(formatted);
  }
});


  return roots;
}



const inactiveMessages = [
  "This employee may no longer be associated with the organization.",
  "The employee appears to be inactive and might have left the company.",
  "This user account is currently inactive.",
  "The employee may have transitioned out of the organization.",
  "This profile indicates an inactive status within the system.",
]


module.exports = {
  createComment,getComments,deleteComment,updateComment
}