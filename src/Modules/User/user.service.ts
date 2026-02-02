import { prisma } from "../../lib/prisma";

const becomeTutor = async (userId: any, tutorData: any) => {
  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "TUTOR" },
    });

    const profile = await tx.tutorProfile.create({
      data: {
        userId: userId,
        bio: tutorData.bio,
        hourlyRate: Number(tutorData.hourlyRate),
        categories: {
          connect: tutorData.categoryIds.map((id: any) => ({ id })),
        },
      },
    });
    return profile;
  });
};

export const userService = { becomeTutor };
