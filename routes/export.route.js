const express = require('express');
const router = express.Router();
const { exportDoctorScheduleToExcel } = require('../controllers/export.controller');

// Export schedule to Excel
// POST /api/schedule/export?startDate=2025-09-29&endDate=2025-10-01
router.get('/export', exportDoctorScheduleToExcel);

module.exports = router;