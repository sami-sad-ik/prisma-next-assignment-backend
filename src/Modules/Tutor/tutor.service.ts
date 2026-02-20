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

const getFeaturedTutors = async () => {
  const featured = await prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    take: 4,
    select: {
      id: true,
      hourlyRate: true,
      bio: true,
      user: { select: { name: true } },
      reviews: { select: { rating: true } },
    },
  });
  return featured.map((tutor) => {
    const total = tutor.reviews.length;
    const avg =
      total > 0 ? tutor.reviews.reduce((a, b) => a + b.rating, 0) / total : 0;
    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      avgRating: Number(avg.toFixed(1)),
      totalReviews: total,
    };
  });
};

const getTeachingSessions = async (tutorId: string) => {
  return await prisma.booking.findMany({
    where: {
      tutorProfile: { userId: tutorId },
    },
    include: {
      student: {
        select: {
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
      availability: {
        startTime: "desc",
      },
    },
  });
};

const getTutorReviews = async (tutorId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      tutorProfile: { userId: tutorId },
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      student: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

export const getTutorProfileByUserId = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      categories: true,
    },
  });

  return profile;
};

const updateTutorProfileInDB = async (userId: string, tutorData: any) => {
  const updatedProfile = await prisma.tutorProfile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: tutorData.bio,
      hourlyRate: Number(tutorData.hourlyRate),
      categories: {
        set: tutorData.categoryIds.map((id: string) => ({ id })),
      },
    },
    include: {
      categories: true,
    },
  });

  return updatedProfile;
};

export const tutorService = {
  getTutors,
  getSpecificTutor,
  getFeaturedTutors,
  getTeachingSessions,
  getTutorReviews,
  updateTutorProfileInDB,
  getTutorProfileByUserId,
};
