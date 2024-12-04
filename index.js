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
app.use(
  cors({
    credentials: true,
    origin: "https://tinghao2024.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.options("*", cors());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined
  }
};
if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie.domain = process.env.NODE_SERVER_DOMAIN;
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