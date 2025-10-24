const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/scheduler.controller');
const { protect } = require('../middlewares/auth');
// const { exportDoctorScheduleToExcel } = require('../controllers/export.controller');

router.post('/create',protect, availabilityController.createAvailability);
router.post('/check/conflict',protect, availabilityController.checkAvailabilityConflict);
router.get('/all',protect, availabilityController.getAvailability);
// router.post('/export', exportDoctorScheduleToExcel);
router.get('/recents',protect, availabilityController.recentSchedule);


router.put('/:id/update',protect, availabilityController.updateAvailability);

router.get("/reservation/:reservationId/detail",protect, availabilityController.getReservationDetailByReserveId);

router.get('/:id/details',protect, availabilityController.getAvailabilityById);
router.patch('/:id/status',protect, availabilityController.updateStatus);
router.delete('/:id/delete',protect, availabilityController.deleteAvailability);
// ✅ Single provider availability (by providerId)
router.get("/availability/:providerId",protect, availabilityController.getAvailabilityByUser);
module.exports = router;
