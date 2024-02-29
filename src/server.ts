import express from "express";
import config from "./config";
import app from "./app";
import { Server } from "http";
import { mongo } from "mongoose";

const app = express();
const port = 3000;

process.on("uncaughtException", (error) => {
  // handle uncaughtException error here
  console.log(error); //
  process.exit(1);
});

let server: Server;

async function startServer() {
  try {
    await mongo.connect(config.database_url as string);
    console.log("Connected to database");

    app.listen(config.port, () => {
      console.log(`Aplication listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("Failed to Cenncect Database", err);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        //
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

startServer();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

process.on("SIGTERM", () => {
  console.log("SIGTERM is recived");
  if (server) {
    server.close();
  }
});
