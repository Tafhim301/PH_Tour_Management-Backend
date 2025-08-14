import express, { Request, Response } from "express";
import cors from "cors";
import "./app/confiq/passport";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/confiq/env";
const app = express();

app.use(
  expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management Backend",
  });
});

app.use(notFound);

app.use(globalErrorHandler);
export default app;
