const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth');
const { BASE_URL } = require('../config/URL');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const sharp = require('sharp');
const { USER_ROLE, getFullForm } = require('../controllers/privilliges.controller');
const User = require('../models/user.model');
// RESTful routes for Users
router.post('/create', userController.createUser);        // Create new user
router.get('/all',protect, userController.getAllUsers);         // Get all users
router.get('/:id', userController.getUserById);     // Get user by ID
router.put('/:id/update',protect, userController.updateUser);      // Update user
router.delete('/:id/delete',protect, userController.deleteUser);   // Delete user
router.patch('/change-password',protect, userController.changeUserPassword);   // Delete user


const storage = multer.memoryStorage();
const upload = multer({ storage });

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

router.post("/:id/upload/profile", protect, upload.single("image"), async (req, res) => {
  try {
    let uid;

    // Determine which user to update
    if ([USER_ROLE.SUPER_ADMIN].includes(req.user.privilege)) {
      uid = req.params.id;
    } else {
      uid = req.user.id;
    }

    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image uploaded" });
    }

    const { buffer } = req.file;
    const filename = `${Date.now()}-profile.webp`;
    const uploadDir = path.join(__dirname, "..", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Optimize and crop the image
    await sharp(buffer)
      .resize(300, 300, { fit: "cover" }) // square crop
      .webp({ quality: 80 })
      .toFile(filepath);

    const imageUrl = `${BASE_URL}/uploads/${filename}`;

    // Get user
    const user = await User.findByPk(uid);
    if (!user) {
      fs.unlinkSync(filepath); // delete newly uploaded image if user not found
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 🔥 Delete old profile image if exists
    if (user.profile) {
      const oldPath = path.join(__dirname, "..", user.profile.replace(`${BASE_URL}/`, ""));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update user record
    user.profile = imageUrl;
    await user.save();

     res.status(200).json({
      message: 'Login successful',
      profile: {
        id: user.id,
        profile: imageUrl,
        username: user.username,
        fullName: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.privilege,
        roleFullForm: getFullForm(user.privilege),
        lastLoginAt: user.lastLoginAt,
        lastLoginIP: user.lastLoginIP,
      },
    });
  } catch (err) {
    console.error("Error uploading profile:", err);
    res.status(500).json({ success: false, error: "Failed to process image" });
  }
});

module.exports = router;
