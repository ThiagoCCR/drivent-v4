import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function getBookingByRoomId(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: {
      roomId,
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
  });
}

async function deleteBooking(bookingId: number) {
  return prisma.booking.delete({
    where: {
      id: bookingId
    },
  });
}

const bookingRepository = {
  getBookingByUserId,
  createBooking,
  getBookingByRoomId,
  deleteBooking
};

export default bookingRepository;
