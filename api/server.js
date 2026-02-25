// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role         role          @default(STUDENT)\n  status       userStatus    @default(ACTIVE)\n  tutorProfile TutorProfile?\n  bookings     Booking[]     @relation("StudentBookings")\n  reviews      Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel TutorProfile {\n  id           String         @id @default(uuid())\n  userId       String         @unique\n  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bio          String\n  hourlyRate   Float\n  categories   Category[]     @relation("TutorCategories")\n  isFeatured   Boolean        @default(false)\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n}\n\nmodel Category {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  tutorProfiles TutorProfile[] @relation("TutorCategories")\n}\n\nmodel Availability {\n  id             String       @id @default(uuid())\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  startTime      DateTime\n  endTime        DateTime\n  isBooked       Boolean      @default(false)\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  booking        Booking?\n\n  @@index([tutorProfileId])\n}\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId String\n  student   User   @relation("StudentBookings", fields: [studentId], references: [id])\n\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  availabilityId String       @unique\n  availability   Availability @relation(fields: [availabilityId], references: [id])\n\n  status BookingStatus @default(CONFIRMED)\n\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String? @db.Text\n\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id])\n\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum userStatus {\n  ACTIVE\n  BANNED\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"role"},{"name":"status","kind":"enum","type":"userStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"categories","kind":"object","type":"Category","relationName":"TutorCategories"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"TutorCategories"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  }
});

// src/app.ts
import cors from "cors";

// src/Modules/User/user.route.ts
import { Router } from "express";

// src/Modules/User/user.service.ts
var becomeTutor = async (userId, tutorData) => {
  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "TUTOR" }
    });
    const profile = await tx.tutorProfile.create({
      data: {
        userId,
        bio: tutorData.bio,
        hourlyRate: Number(tutorData.hourlyRate),
        categories: {
          connect: tutorData.categoryIds.map((id) => ({ id }))
        }
      }
    });
    return profile;
  });
};
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
  return users;
};
var toggleUserStatus = async (userId, newStatus) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    select: { id: true, status: true }
  });
};
var userService = { becomeTutor, getAllUsers, toggleUserStatus };

// src/Modules/User/user.controller.ts
var becomeTutor2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const { bio, hourlyRate, categoryIds } = data;
    const result = await userService.becomeTutor(userId, {
      bio,
      hourlyRate,
      categoryIds
    });
    res.status(201).json({
      success: true,
      message: "You are a tutor now",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to become tutor!" });
  }
};
var getAllUsers2 = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};
var toggleUserStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: "newStatus is required (e.g., 'ACTIVE' or 'BLOCKED')"
      });
    }
    const result = await userService.toggleUserStatus(id, newStatus);
    res.status(200).json({
      success: true,
      message: `User status updated to ${newStatus} successfully`,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};
var userController = { becomeTutor: becomeTutor2, getAllUsers: getAllUsers2, toggleUserStatus: toggleUserStatus2 };

// src/Middleware/authMiddleware.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session)
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!"
        });
      req.user = {
        id: session?.user.id,
        email: session.user.email,
        role: session.user.role
      };
      if (roles.length > 0 && !roles.includes(session.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this resource."
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication."
      });
    }
  };
};
var authMiddleware_default = authMiddleware;

// src/Modules/User/user.route.ts
var router = Router();
router.post("/tutor", authMiddleware_default(), userController.becomeTutor);
router.get("/", authMiddleware_default("ADMIN"), userController.getAllUsers);
router.patch(
  "/:id/status",
  authMiddleware_default("ADMIN"),
  userController.toggleUserStatus
);
var userRoute = router;

// src/Modules/Availability/availability.route.ts
import { Router as Router2 } from "express";

// src/Modules/Availability/availability.service.ts
var setAvailability = async (userId, data) => {
  return await prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile) throw new Error("Tutor not found");
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    if (startTime <= /* @__PURE__ */ new Date()) {
      throw new Error("You can't set availability in past");
    }
    if (startTime >= endTime) {
      throw new Error("End time must be later than the start time");
    }
    const overlap = await tx.availability.findFirst({
      where: {
        tutorProfileId: tutorProfile.id,
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
    if (overlap)
      throw new Error("This slot overlaps with your existing schedule.");
    const result = await tx.availability.create({
      data: {
        tutorProfileId: tutorProfile.id,
        startTime,
        endTime
      }
    });
    return result;
  });
};
var getAvailability = async (userId) => {
  const result = await prisma.availability.findMany({
    where: { tutorProfile: { userId } },
    orderBy: { createdAt: "asc" }
  });
  return result;
};
var deleteAbility = async (id, userId) => {
  const result = await prisma.availability.delete({
    where: {
      id,
      tutorProfile: { userId }
    }
  });
  return result;
};
var availabilityService = {
  setAvailability,
  getAvailability,
  deleteAbility
};

// src/Modules/Availability/availability.controller.ts
var setAvailability2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startTime, endTime } = req.body;
    const result = await availabilityService.setAvailability(userId, {
      startTime,
      endTime
    });
    res.status(201).json({
      success: true,
      message: "Availability set successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to set availability"
    });
  }
};
var getAvailability2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await availabilityService.getAvailability(userId);
    res.status(200).json({
      success: true,
      message: "Retrieved availability successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to retrieve availability!"
    });
  }
};
var deleteAbility2 = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const result = await availabilityService.deleteAbility(
      id,
      userId
    );
    res.status(200).json({
      success: true,
      message: "Deleted availability successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete availability!"
    });
  }
};
var availabilityController = {
  setAvailability: setAvailability2,
  getAvailability: getAvailability2,
  deleteAbility: deleteAbility2
};

// src/Modules/Availability/availability.route.ts
var router2 = Router2();
router2.post(
  "/",
  authMiddleware_default("TUTOR"),
  availabilityController.setAvailability
);
router2.get(
  "/",
  authMiddleware_default("TUTOR"),
  availabilityController.getAvailability
);
router2.delete(
  "/:id",
  authMiddleware_default("TUTOR"),
  availabilityController.deleteAbility
);
var availabilityRoute = router2;

// src/Modules/Booking/booking.route.ts
import { Router as Router3 } from "express";

// src/Modules/Booking/booking.service.ts
var postBooking = async (studentId, availabilityId) => {
  return await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUnique({
      where: { id: availabilityId }
    });
    if (!availability) throw new Error("Availability slot not found");
    if (availability.isBooked === true)
      throw new Error("The slot is already booked!");
    const tutorProfile = await tx.tutorProfile.findUnique({
      where: { id: availability.tutorProfileId }
    });
    if (tutorProfile?.userId === studentId)
      throw new Error("You can't book your own session!");
    const booking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId: availability?.tutorProfileId,
        availabilityId,
        status: "CONFIRMED"
      }
    });
    await tx.availability.update({
      where: { id: availabilityId },
      data: { isBooked: true }
    });
    return booking;
  });
};
var getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      status: true,
      createdAt: true,
      student: {
        select: { name: true, email: true }
      },
      tutorProfile: {
        select: {
          user: { select: { name: true, email: true } }
        }
      },
      availability: {
        select: { startTime: true, endTime: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return bookings;
};
var getTutorSessions = async (userId) => {
  const sessions = await prisma.booking.findMany({
    where: {
      tutorProfile: { userId }
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      availability: {
        select: {
          startTime: true,
          endTime: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return sessions;
};
var getBookingsByUser = async (studentId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      studentId
    },
    include: {
      availability: { select: { startTime: true, endTime: true } },
      tutorProfile: { select: { user: { select: { name: true } } } }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};
var completeSessionByTutor = async (bookingId) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { availability: true }
    });
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.status !== "CONFIRMED") {
      throw new Error("Only confirmed sessions can be completed");
    }
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED"
      }
    });
    return updated;
  });
};
var cancelSessionByTutor = async (bookingId) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.status === "COMPLETED") {
      throw new Error("Completed session cannot be cancelled");
    }
    if (booking.status === "CANCELLED") {
      throw new Error("Session already cancelled");
    }
    const cancelledBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED"
      }
    });
    await tx.availability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false }
    });
    return cancelledBooking;
  });
};
var bookingService = {
  postBooking,
  getAllBookings,
  getTutorSessions,
  completeSessionByTutor,
  cancelSessionByTutor,
  getBookingsByUser
};

// src/Modules/Booking/booking.controller.ts
var postBooking2 = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { availabilityId } = req.body;
    const result = await bookingService.postBooking(studentId, availabilityId);
    res.status(201).json({
      success: true,
      message: "Successfully booked the session",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Booking failed"
    });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const result = await bookingService.getAllBookings();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Booking failed"
    });
  }
};
var getTutorSessions2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await bookingService.getTutorSessions(userId);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Booking failed"
    });
  }
};
var completeSession = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const result = await bookingService.completeSessionByTutor(
      tutorId
    );
    res.status(201).json({
      success: true,
      message: "Successfully completed the session",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Completion failed"
    });
  }
};
var cancelSession = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const result = await bookingService.completeSessionByTutor(
      tutorId
    );
    res.status(201).json({
      success: true,
      message: "Successfully cancelled the session",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Cancellation failed"
    });
  }
};
var getBookingsBySpecificUser = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await bookingService.getBookingsByUser(studentId);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all bookings",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to retrieve bookings"
    });
  }
};
var bookingController = {
  postBooking: postBooking2,
  getAllBookings: getAllBookings2,
  getTutorSessions: getTutorSessions2,
  completeSession,
  cancelSession,
  getBookingsBySpecificUser
};

// src/Modules/Booking/booking.route.ts
var router3 = Router3();
router3.post(
  "/",
  authMiddleware_default("STUDENT", "TUTOR"),
  bookingController.postBooking
);
router3.get("/all", authMiddleware_default("ADMIN"), bookingController.getAllBookings);
router3.get(
  "/tutor-sessions",
  authMiddleware_default("TUTOR"),
  bookingController.getTutorSessions
);
router3.get(
  "/student",
  authMiddleware_default("STUDENT", "TUTOR"),
  bookingController.getBookingsBySpecificUser
);
router3.patch(
  "/complete/:id",
  authMiddleware_default("TUTOR"),
  bookingController.completeSession
);
router3.patch(
  "/cancel/:id",
  authMiddleware_default("TUTOR"),
  bookingController.cancelSession
);
var bookingRoute = router3;

// src/Modules/Review/review.route.ts
import { Router as Router4 } from "express";

// src/Modules/Review/review.service.ts
var postReview = async (studentId, bookingId, rating, comment) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutorProfile: true }
  });
  if (!booking) throw new Error("Booking not found!");
  if (booking.studentId !== studentId) {
    throw new Error("You are not authorized to review this session");
  }
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5!");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review this session after complete!");
  }
  const review = await prisma.review.create({
    data: {
      studentId,
      tutorProfileId: booking.tutorProfileId,
      bookingId,
      rating,
      comment
    }
  });
  return review;
};
var getTutorReviewsFromDB = async (userId) => {
  const result = await prisma.review.findMany({
    where: { tutorProfile: { userId } },
    include: { student: { select: { name: true } } }
  });
  return result;
};
var reviewService = { postReview, getTutorReviewsFromDB };

// src/Modules/Review/review.controller.ts
var postReview2 = (req, res) => {
  try {
    const studentId = req.user.id;
    const { bookingId, rating, comment } = req.body;
    const result = reviewService.postReview(
      studentId,
      bookingId,
      rating,
      comment
    );
    res.status(201).json({
      success: true,
      message: "Successfully Reviewed this session",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getTutorReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await reviewService.getTutorReviewsFromDB(userId);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all the reviews",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var reviewController = { postReview: postReview2, getTutorReviews };

// src/Modules/Review/review.route.ts
var router4 = Router4();
router4.post(
  "/",
  authMiddleware_default("STUDENT", "TUTOR"),
  reviewController.postReview
);
router4.get("/", authMiddleware_default("TUTOR"), reviewController.getTutorReviews);
var reviewRouter = router4;

// src/Modules/Tutor/tutor.service.ts
var getTutors = async ({
  search,
  categoryId
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { bio: { contains: search, mode: "insensitive" } }
      ]
    });
  }
  if (categoryId) {
    andConditions.push({
      categories: {
        some: { id: categoryId }
      }
    });
  }
  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
  const tutors = await prisma.tutorProfile.findMany({
    where: whereConditions,
    include: {
      user: { select: { name: true } },
      reviews: { select: { rating: true } }
    }
  });
  return tutors.map((tutor) => {
    const totalReviews = tutor.reviews.length;
    const avgRating = totalReviews > 0 ? tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;
    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews
    };
  });
};
var getSpecificTutor = async (tutorId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: { select: { name: true } },
      reviews: {
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
      },
      availability: {
        where: { isBooked: false },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  if (!tutor) throw new Error("Tutor not found");
  const totalReviews = tutor.reviews.length;
  const avgRating = totalReviews > 0 ? tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;
  return {
    ...tutor,
    avgRating: Number(avgRating.toFixed(1)),
    totalReviews
  };
};
var getFeaturedTutors = async () => {
  const featured = await prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    take: 4,
    select: {
      id: true,
      hourlyRate: true,
      bio: true,
      user: { select: { name: true } },
      reviews: { select: { rating: true } }
    }
  });
  return featured.map((tutor) => {
    const total = tutor.reviews.length;
    const avg = total > 0 ? tutor.reviews.reduce((a, b) => a + b.rating, 0) / total : 0;
    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      hourlyRate: tutor.hourlyRate,
      avgRating: Number(avg.toFixed(1)),
      totalReviews: total
    };
  });
};
var getTeachingSessions = async (tutorId) => {
  return await prisma.booking.findMany({
    where: {
      tutorProfile: { userId: tutorId }
    },
    include: {
      student: {
        select: {
          name: true,
          email: true
        }
      },
      availability: {
        select: {
          startTime: true,
          endTime: true
        }
      }
    },
    orderBy: {
      availability: {
        startTime: "desc"
      }
    }
  });
};
var getTutorReviews2 = async (tutorId) => {
  const reviews = await prisma.review.findMany({
    where: {
      tutorProfile: { userId: tutorId }
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      student: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var getTutorProfileByUserId = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: {
      userId
    },
    include: {
      categories: true
    }
  });
  return profile;
};
var updateTutorProfileInDB = async (userId, tutorData) => {
  const updatedProfile = await prisma.tutorProfile.update({
    where: {
      userId
    },
    data: {
      bio: tutorData.bio,
      hourlyRate: Number(tutorData.hourlyRate),
      categories: {
        set: tutorData.categoryIds.map((id) => ({ id }))
      }
    },
    include: {
      categories: true
    }
  });
  return updatedProfile;
};
var tutorService = {
  getTutors,
  getSpecificTutor,
  getFeaturedTutors,
  getTeachingSessions,
  getTutorReviews: getTutorReviews2,
  updateTutorProfileInDB,
  getTutorProfileByUserId
};

// src/Modules/Tutor/tutor.controller.ts
var getTutors2 = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const categoryIdString = typeof categoryId === "string" ? categoryId : void 0;
    const result = await tutorService.getTutors({
      search: searchString,
      categoryId: categoryIdString
    });
    res.status(200).json({
      success: true,
      message: "All tutors fetched successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getSpecificTutor2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tutorService.getSpecificTutor(id);
    res.status(200).json({
      success: true,
      message: "Tutor details fetched successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getFeaturedTutor = async (req, res) => {
  try {
    const result = await tutorService.getFeaturedTutors();
    res.status(200).json({
      success: true,
      message: "Featured tutors fetched successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getTeachingSessions2 = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await tutorService.getTeachingSessions(tutorId);
    res.status(200).json({
      success: true,
      message: "All teaching sessions retrieved successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getTutorReviews3 = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await tutorService.getTutorReviews(tutorId);
    res.status(200).json({
      success: true,
      message: "All reviews retrieved successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var getTutorProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const result = await tutorService.getTutorProfileByUserId(id);
    res.status(200).json({
      success: true,
      message: "Tutor profile fetched successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var updateTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const result = await tutorService.updateTutorProfileInDB(userId, data);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile"
    });
  }
};
var tutorController = {
  getTutors: getTutors2,
  getSpecificTutor: getSpecificTutor2,
  getFeaturedTutor,
  getTeachingSessions: getTeachingSessions2,
  getTutorReviews: getTutorReviews3,
  getTutorProfile,
  updateTutorProfile
};

// src/Modules/Tutor/tutor.route.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/", tutorController.getTutors);
router5.get("/featured", tutorController.getFeaturedTutor);
router5.get(
  "/sessions",
  authMiddleware_default("TUTOR"),
  tutorController.getTeachingSessions
);
router5.get(
  "/profile",
  authMiddleware_default("TUTOR"),
  tutorController.getTutorProfile
);
router5.get(
  "/reviews",
  authMiddleware_default("TUTOR"),
  tutorController.getTutorReviews
);
router5.put("/", authMiddleware_default("TUTOR"), tutorController.updateTutorProfile);
router5.get("/:id", tutorController.getSpecificTutor);
var tutorRoute = router5;

// src/Modules/Category/category.route.ts
import { Router as Router6 } from "express";

// src/Modules/Category/category.service.ts
var createCategory = async (name) => {
  const categoryName = name.trim().toLowerCase();
  const existingCategory = await prisma.category.findUnique({
    where: { name: categoryName }
  });
  if (existingCategory) {
    throw new Error("This category already exists!");
  }
  const result = await prisma.category.create({
    data: {
      name: categoryName
    }
  });
  return result;
};
var getCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true
    }
  });
  return categories;
};
var categoryService = {
  createCategory,
  getCategoriesFromDB
};

// src/Modules/Category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryService.createCategory(name);
    res.status(201).json({
      success: true,
      message: "Added new category",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var getCategories = async (req, res) => {
  try {
    const result = await categoryService.getCategoriesFromDB();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all categories",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to retrieve categories!"
    });
  }
};
var categoryController = { createCategory: createCategory2, getCategories };

// src/Modules/Category/category.route.ts
var router6 = Router6();
router6.post("/", authMiddleware_default("ADMIN"), categoryController.createCategory);
router6.get("/", categoryController.getCategories);
var categoryRoute = router6;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [process.env.APP_URL],
    credentials: true
  })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", userRoute);
app.use("/api/tutor/availability", availabilityRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/tutors", tutorRoute);
app.use("/api/category", categoryRoute);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 5e3;
var main = () => {
  app_default.listen(port, () => console.log(`server is running on port ${port}`));
};
main();
