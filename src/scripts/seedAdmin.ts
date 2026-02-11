import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Dr.admin",
      email: "admin2@pr.com",
      role: "ADMIN",
      password: "password1234",
    };
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });
    if (existingUser) throw new Error("User already exists!");
    const signupAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.APP_URL!,
        },
        body: JSON.stringify(adminData),
      },
    );
    console.log(signupAdmin);
    return signupAdmin;
  } catch (err) {
    console.log(err);
  }
};

seedAdmin();
