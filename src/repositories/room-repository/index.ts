import { prisma } from "@/config";
import { Room } from "@prisma/client";

async function getRoomById(roomId: number): Promise<Room> {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const roomRepository = {
  getRoomById
};

export default roomRepository;
