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

const getCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
  return categories;
};

export const categoryService = {
  createCategory,
  getCategoriesFromDB,
};
