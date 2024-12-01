import * as enrollmentsDao from "./dao.js";
import * as courseDao from "../Courses/dao.js";

export default function EnrollmentsRoutes(app) {

  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const enrollments = enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.send(enrollments);
  });

  app.delete("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const enrollments = enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.send(enrollments);
  });

  app.get("/api/enrollments/all", (req, res) => {
    try {
      const courses = courseDao.getAllCourses();
      res.send(courses);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      res.status(500).send({ message: "Failed to fetch courses." });
    }
  });

  app.get("/api/enrollments/:userId", (req, res) => {
    const { userId } = req.params;
    const enrollments = enrollmentsDao.getEnrollmentsForUser(userId);
    res.send(enrollments);
  });
}
