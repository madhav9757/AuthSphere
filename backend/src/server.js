import { createServer } from "http";
import { conf } from "./configs/env.js";
import app from "./app.js";
import connectDB from "./database/connectDB.js";
import { logStartup } from "./utils/startup.js";
import { initSocket } from "./services/core/socket.service.js";

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(conf.port, () => {
      logStartup(conf.port);
    });
  } catch (error) {
    console.error("✖ Server failed to start", error);
    process.exit(1);
  }
};

startServer();
