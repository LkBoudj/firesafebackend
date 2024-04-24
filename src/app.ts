import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import local, {
  deserializeUser,
  serializeUser,
} from "./configs/strategy/local";
import { authRouter, cameraRouter, userRouter } from "./routers";
import { __dirPath } from "./utils/helper";
import path from "path";

const ejs = require("ejs");
const app: Express = express();

//morgan
app.use(morgan("dev"));
// cors origin path
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));
app.set("views", path.join(__dirPath, "views"));

app.set("view engine", "ejs");
// session

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(local);

/*______________ ROUTERS_________________ */
app.get("/", (req, res) => {
  res.render("index", { video_path: "test/output.m3u8" });
});
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/cameras", cameraRouter);

// FFmpeg command options (adjust as needed)

/*______________ ROUTERS_________________ */

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    data: null,
    errors: [
      {
        message: error.message,
      },
    ],
  });
});

export default app;
