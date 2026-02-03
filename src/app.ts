import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { userRoute } from "./Modules/User/user.route";
import { availabilityRoute } from "./Modules/Availability/availability.route";
import { bookingRoute } from "./Modules/Booking/booking.route";

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(
  cors({
    origin: [process.env.APP_URL!],
  }),
);

app.use("/api/user", userRoute);
app.use("/api/tutor/availability", availabilityRoute);
app.use("/api/bookings", bookingRoute);

export default app;
