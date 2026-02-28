import { prisma } from "../../lib/prisma";

const getHomepageStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const tutors = await tx.user.count({
      where: {
        role: "TUTOR",
        status: "ACTIVE",
      },
    });

    const students = await tx.user.count({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
      },
    });

    const bookings = await tx.booking.count({
      where: {
        status: "COMPLETED",
      },
    });

    return {
      tutors,
      students,
      bookings,
    };
  });
};

export const statsService = { getHomepageStats };
