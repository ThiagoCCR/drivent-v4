import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBooking, createBooking, updateBooking } from "@/controllers";
import { upsertBookingSchema } from "@/schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(upsertBookingSchema), createBooking)
  .put("/", validateBody(upsertBookingSchema), updateBooking);

export { bookingsRouter };
