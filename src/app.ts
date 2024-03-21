import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import cookieparser from 'cookie-parser';
import routes from './app/Routes';
import fileupload from 'express-fileupload';
import config from './config';
import httpStatus from 'http-status';
import globalErrorHandler from './middleware/globalErrorHandler';

const app = express();

app.set('view engine', 'ejs'); // set the view engine to ejs

app.use(
  fileupload({
    useTempFiles: true,
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //
app.use(cookieparser());
app.use(express.static('public')); // means
app.use(morgan('dev'));
app.use(
  session({
    secret: config.session_secret as string, // Generate a new secret key on server restart
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if your app is served over HTTPS
      // maxAge: 1000 * 60 * 5,
      httpOnly: true,
    },
  }),
);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/', routes);

// Handle Error Handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API NotFound',
      },
    ],
  });
  next();
});

export default app;
