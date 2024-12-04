import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/router.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/router.js";
import "dotenv/config";
import session from "express-session";
import AssignmentRoutes from "./Kanbas/Assignments/router.js";
import EnrollmentsRoutes from "./Kanbas/Enrollments/router.js";

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);
app.options("*", cors());

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  proxy: true
};

if (process.env.NODE_ENV === "production") {
  sessionOptions.cookie.domain = ".onrender.com";
}

app.use(session(sessionOptions));

app.use(express.json());
app.use(express.json());
Lab5(app);
Hello(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentsRoutes(app);

app.listen(process.env.PORT || 4000);