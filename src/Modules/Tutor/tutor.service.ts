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
        ? tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0)
        : 0;

    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      avgRating,
      totalReviews,
    };
  });
};

export const tutorService = { getTutors };
