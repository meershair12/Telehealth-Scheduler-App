const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const { protect } = require("../middlewares/auth");

// CRUD Routes
router.post("/create",protect, reservationController.createReservation);
router.get("/",protect, reservationController.getReservations);
router.get("/:id", protect,reservationController.getReservationById);
router.put("/:id/update",protect, reservationController.updateReservation);
router.delete("/:id/delete",protect, reservationController.deleteReservation);
router.patch("/:id/confirm",protect, reservationController.confirmReservation);
router.patch("/:id/cancel",protect, reservationController.cancellationAppointment);
router.patch("/:id/update-status",protect, reservationController.updateAppointmentStatus);

module.exports = router;
