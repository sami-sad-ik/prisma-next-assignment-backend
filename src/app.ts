import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { userRoute } from "./Modules/User/user.route";
import { availabilityRoute } from "./Modules/Availability/availability.route";
import { bookingRoute } from "./Modules/Booking/booking.route";
import { reviewRouter } from "./Modules/Review/review.route";
import { tutorRoute } from "./Modules/Tutor/tutor.route";
import { categoryRoute } from "./Modules/Category/category.route";
import { statsRoute } from "./Modules/Stats/stats.route";

const app = express();

// CORS configuration for cross-domain requests
const allowedOrigins = [
  process.env.APP_URL || "https://prisma-assignment-server.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001", // in case you use different port
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/user", userRoute);
app.use("/api/tutor/availability", availabilityRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/tutors", tutorRoute);
app.use("/api/category", categoryRoute);
app.use("/api/stats", statsRoute);

export default app;
