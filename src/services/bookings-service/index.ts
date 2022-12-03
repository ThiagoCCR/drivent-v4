import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, forbiddenError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/room-repository";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }
  const booking = await bookingRepository.getBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }
  
  const userBooking = {
    id: booking.id,
    Room: booking.Room
  };

  return userBooking;
}

async function createBooking(userId: number, roomId: number) {  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const userBooking = await bookingRepository.getBookingByUserId(userId);

  if (userBooking) {
    throw forbiddenError();
  }

  const room = await roomRepository.getRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  const roomBookings = await bookingRepository.getBookingByRoomId(roomId);

  if (roomBookings.length >= room.capacity) {
    throw forbiddenError();
  }

  const createdBooking = await bookingRepository.createBooking(userId, roomId);

  return createdBooking;
}

async function updateBooking(userId: number, roomId: number) {  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await roomRepository.getRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  const userBooking = await bookingRepository.getBookingByUserId(userId);

  if (!userBooking) {
    throw forbiddenError();
  }

  const roomBookings = await bookingRepository.getBookingByRoomId(roomId);

  if (roomBookings.length >= room.capacity) {
    throw forbiddenError();
  }

  const updatedBooking = await bookingRepository.createBooking(userId, roomId);
  await bookingRepository.deleteBooking(userBooking.id);

  return updatedBooking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
