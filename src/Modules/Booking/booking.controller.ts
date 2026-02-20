import { RequestHandler } from "express";
import { bookingService } from "./booking.service";

const postBooking: RequestHandler = async (req, res) => {
  try {
    const studentId = req.user!.id;
    const { availabilityId } = req.body;
    const result = await bookingService.postBooking(studentId, availabilityId);
    res.status(201).json({
      success: true,
      message: "Successfully booked the session",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Booking failed",
    });
  }
};

const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const result = await bookingService.getAllBookings();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Booking failed",
    });
  }
};

const getTutorSessions: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const result = await bookingService.getAllBookingsFromDB(userId);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Booking failed",
    });
  }
};

const completeSession: RequestHandler = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const result = await bookingService.completeSessionByTutor(
      tutorId as string,
    );
    res.status(201).json({
      success: true,
      message: "Successfully completed the session",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Completion failed",
    });
  }
};

const cancelSession: RequestHandler = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const result = await bookingService.completeSessionByTutor(
      tutorId as string,
    );
    res.status(201).json({
      success: true,
      message: "Successfully cancelled the session",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Cancellation failed",
    });
  }
};

export const bookingController = {
  postBooking,
  getAllBookings,
  getTutorSessions,
  completeSession,
  cancelSession,
};
