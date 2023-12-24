import mongoose from "mongoose";
import express from "express";
import { mongoDBUrl, port } from "./utils/config.js";
import l from "./utils/logger.js";
import routes from "./controllers/index.js";

const app = express();
let server;

app.use(express.json());

mongoose.connect(mongoDBUrl).then(() => {
  l.info("Connected to MONGODB");
  server = app.listen(port, () => {
    l.info("Listening on PORT :" + port);
    routes(app);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      l.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  l.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  l.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

export default app;
