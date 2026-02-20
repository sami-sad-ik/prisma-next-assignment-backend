import { prisma } from "../../lib/prisma";

const setAvailability = async (userId: string, data: any) => {
  return await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.findUnique({
      where: { userId },
    });
    if (!tutorProfile) throw new Error("Tutor not found");
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    if (startTime <= new Date()) {
      throw new Error("You can't set availability in past");
    }
    if (startTime >= endTime) {
      throw new Error("End time must be later than the start time");
    }
    const overlap = await tx.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (overlap)
      throw new Error("This slot overlaps with your existing schedule.");
    const result = await tx.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        startTime,
        endTime,
      },
    });
    return result;
  });
};

const getAvailability = async (userId: string) => {
  const result = await prisma.availability.findMany({
    where: { tutorProfile: { userId } },
    orderBy: { createdAt: "asc" },
  });
  return result;
};

const deleteAbility = async (id: string, userId: string) => {
  const result = await prisma.availability.delete({
    where: {
      id,
      tutorProfile: { userId },
    },
  });
  return result;
};

export const availabilityService = {
  setAvailability,
  getAvailability,
  deleteAbility,
};
