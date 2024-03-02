import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import routes from "./app/Routes";

import { config } from "./config";
import passport from "passport";
import httpStatus from "http-status";
import globalErrorHandler from "./middlewares/errorHandler";

const app = express();

app.set("view engine", "ejs"); // set the view engine to ejs

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //
app.use(cookieparser());

app.use(morgan("dev"));
app.use(
  session({
    secret: config.SESSION_SECRET as string,
    resave: false, //
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

app.use("/api/v1/", routes);

// Handle Error Handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API NotFound",
      },
    ],
  });
  next();
});

export default app;
