import { prisma } from "../../lib/prisma";

const createCategory = async (name: string) => {
  const categoryName = name.trim();
  const existingCategory = await prisma.category.findUnique({
    where: { name: categoryName },
  });

  if (existingCategory) {
    throw new Error("This category already exists!");
  }

  const result = await prisma.category.create({
    data: {
      name: categoryName,
    },
  });

  return result;
};

export const categoryService = {
  createCategory,
};
