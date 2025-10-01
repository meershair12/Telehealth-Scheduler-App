// routes/stats.routes.js
const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDetailedStats,
  getRealTimeStats
} = require('../controllers/stats.controller');
const { protect } = require('../middlewares/auth');

// Middleware for authentication (add your auth middleware here)
// const authenticateToken = require('../middleware/auth.middleware');

// @route   GET /api/stats/dashboard
// @desc    Get main dashboard statistics
// @access  Private
router.get('/dashboard',protect, getDashboardStats);

// @route   GET /api/stats/detailed
// @desc    Get detailed statistics with breakdowns
// @access  Private
router.get('/detailed',protect, getDetailedStats);

// @route   GET /api/stats/realtime
// @desc    Get real-time statistics
// @access  Private
router.get('/realtime',protect, getRealTimeStats);

module.exports = router;