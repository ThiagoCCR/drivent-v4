import Joi from "joi";

export const upsertBookingSchema = Joi.object({
  roomId: Joi.number().min(1).required(),
});
