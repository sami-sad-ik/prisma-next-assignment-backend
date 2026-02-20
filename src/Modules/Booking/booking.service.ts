import { prisma } from "../../lib/prisma";

const postBooking = async (studentId: string, availabilityId: string) => {
  return await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId },
    });
    if (!availability) throw new Error("Availability slot not found");
    if (availability.isBooked === true)
      throw new Error("The slot is already booked!");

    const tutorProfile = await tx.tutorProfile.findUnique({
      where: { id: availability.tutorProfileId },
    });
    if (tutorProfile?.userId === studentId)
      throw new Error("You can't book your own session!");
    const booking = await tx.booking.create({
      data: {
        studentId: studentId,
        tutorProfileId: availability?.tutorProfileId,
        availabilityId: availabilityId,
        status: "CONFIRMED",
      },
    });

    await tx.availability.update({
      where: { id: availabilityId },
      data: { isBooked: true },
    });

    return booking;
  });
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      student: { select: { name: true, email: true } },
      tutorProfile: {
        include: { user: { select: { name: true, email: true } } },
      },
      availability: {
        select: { startTime: true, endTime: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

const getAllBookingsFromDB = async (userId: string) => {
  const sessions = await prisma.booking.findMany({
    where: {
      tutorProfile: { userId },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      availability: {
        select: {
          startTime: true,
          endTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sessions;
};

const completeSessionByTutor = async (bookingId: string) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { availability: true },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "CONFIRMED") {
      throw new Error("Only confirmed sessions can be completed");
    }

    // // optional but recommended
    // const now = new Date();
    // if (now < booking.availability.endTime) {
    //   throw new Error("Session time has not ended yet");
    // }

    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
      },
    });
    return updated;
  });
};

const cancelSessionByTutor = async (bookingId: string) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "COMPLETED") {
      throw new Error("Completed session cannot be cancelled");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Session already cancelled");
    }

    const cancelledBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });

    await tx.availability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false },
    });

    return cancelledBooking;
  });
};

export const bookingService = {
  postBooking,
  getAllBookings,
  getAllBookingsFromDB,
  completeSessionByTutor,
  cancelSessionByTutor,
};
