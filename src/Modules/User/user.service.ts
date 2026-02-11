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

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return users;
};

const toggleUserStatus = async (
  userId: string,
  newStatus: "ACTIVE" | "BANNED",
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found!");
  return await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });
};

export const userService = { becomeTutor, getAllUsers, toggleUserStatus };
