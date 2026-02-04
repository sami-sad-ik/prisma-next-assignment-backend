import { prisma } from "../../lib/prisma";

const getTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    include: {
      user: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
  });
  return tutors.map((tutor) => {
    const totalReviews = tutor.reviews.length;
    const avgRating =
      totalReviews > 0
        ? tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
        : 0;

    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews,
    };
  });
};

const getSpecificTutor = async (tutorId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: { select: { name: true } },
      reviews: {
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      availability: {
        where: { isBooked: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!tutor) throw new Error("Tutor not found");
  const totalReviews = tutor.reviews.length;
  const avgRating =
    totalReviews > 0
      ? tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
      : 0;

  return {
    ...tutor,
    avgRating: Number(avgRating.toFixed(1)),
    totalReviews,
  };
};

export const tutorService = { getTutors, getSpecificTutor };
