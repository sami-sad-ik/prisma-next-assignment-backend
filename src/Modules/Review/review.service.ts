import { prisma } from "../../lib/prisma";

const postReview = async (
  studentId: string,
  bookingId: string,
  rating: number,
  comment: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutorProfile: true },
  });
  if (!booking) throw new Error("Booking not found!");
  if (booking.studentId !== studentId) {
    throw new Error("You are not authorized to review this session");
  }
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5!");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review this session after complete!");
  }

  const review = await prisma.review.create({
    data: {
      studentId: studentId,
      tutorProfileId: booking.tutorProfileId,
      bookingId: bookingId,
      rating: rating,
      comment: comment,
    },
  });
  return review;
};

const getTutorReviewsFromDB = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: { tutorProfile: { userId } },
    include: { student: { select: { name: true } } },
  });
  return result;
};

export const reviewService = { postReview, getTutorReviewsFromDB };
