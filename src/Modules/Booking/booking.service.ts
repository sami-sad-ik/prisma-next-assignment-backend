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

export const bookingService = { postBooking, getAllBookings };
