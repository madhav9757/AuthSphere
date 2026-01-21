
import { conf } from "./configs/env.js"
import app from "./app.js";
import connectDB from "./database/connectDB.js";
import { logStartup } from "./utils/startup.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(conf.port, () => {
      logStartup(conf.port);
    });

  } catch (error) {
    console.error("✖ Server failed to start");
    process.exit(1);
  }
};

startServer();
