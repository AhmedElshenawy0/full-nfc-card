import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import cardRoute from "./routes/cardRoute";
import clientRoute from "./routes/clientRoute";
import serviceRoute from "./routes/serviceRoute";
import soldServiceRoute from "./routes/soldRoute";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import "./utils/passport";
import path from "path";
import { errorHandler } from "./middleware/ErrorHandler";
import * as fs from "fs";
dotenv.config();

const app = express();
// HINT COMMENT
// const sslOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, "../ssl/private.key")),
//   cert: fs.readFileSync(path.resolve(__dirname, "../ssl/certificate.crt")),
// };

const port = process.env.PORT;

//=> Middleware
app.set("trust proxy", true);

app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false, // Avoid recreating session on each request
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//=> routes
app.use("/api/auth", authRoute);
app.use("/api/cards", cardRoute);
app.use("/api/clients", clientRoute);
app.use("/api/services", serviceRoute);
app.use("/api/soldServices", soldServiceRoute);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
console.log("form server filee", path.join(__dirname, "./uploads"));

app.use(express.static(path.join(__dirname, "../public")));

const fileSizeErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): express.Response | void => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "Image too large. Max 3MB allowed." });
  }
  return next(err);
};

app.use(fileSizeErrorHandler as express.ErrorRequestHandler);

app.use(errorHandler as express.ErrorRequestHandler);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

//=> Start server

// HINT COMMENT
//https.createServer(sslOptions, app).listen(port);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
