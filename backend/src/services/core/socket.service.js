import { Server } from "socket.io";
import logger from "../../utils/logger.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // In production, refine this to allowed origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { projectId } = socket.handshake.query;

    if (projectId) {
      socket.join(projectId);
      logger.info(`Socket connected & joined project: ${projectId}`);
    }

    socket.on("disconnect", () => {
      logger.info("Socket disconnected");
    });
  });

  return io;
};

export const emitEvent = (projectId, event, data) => {
  if (io) {
    io.to(projectId).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getIO = () => io;
