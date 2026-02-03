import { prisma } from "../../lib/prisma";

const setAvailability = async (userId: string, data: any) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
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
  const overlap = await prisma.availability.findFirst({
    where: {
      tutorProfileId: tutorProfile.id,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });
  if (overlap)
    throw new Error("This slot overlaps with your existing schedule.");
  const result = await prisma.availability.create({
    data: {
      tutorProfileId: tutorProfile.id,
      startTime: startTime,
      endTime: endTime,
    },
  });
  return result;
};

export const availabilityService = { setAvailability };
