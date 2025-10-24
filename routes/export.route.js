const express = require('express');
const router = express.Router();
const {  generateReport } = require('../controllers/export.controller');
const { generateSummaryReport } = require('../controllers/reportSummary');

// Export schedule to Excel
// POST /api/schedule/export?startDate=2025-09-29&endDate=2025-10-01
// router.get('/export', exportDoctorScheduleToExcel);

// router.post("/generate", generateReport);
router.post("/generate", generateSummaryReport);

module.exports = router;