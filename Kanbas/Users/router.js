import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js"
import * as enrollmentsDao from "../Enrollments/dao.js";

// 添加 requireLogin 中间件
const requireLogin = (req, res, next) => {
  console.log("Session in requireLogin:", req.session);
  console.log("Current user in session:", req.session.currentUser);
  const currentUser = req.session.currentUser;
  if (!currentUser) {
    return res.status(401).json({ 
      message: "请先登录",
      session: req.session,
      cookies: req.headers.cookie 
    });
  }
  next();
};

export default function UserRoutes(app) {
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };
  const findUserById = (req, res) => {
    const {userId} = req.params;
    const user = dao.findUserById(userId);
    res.json(user);
  };
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = dao.findUserByCredentials(username, password);
      if (currentUser) {
        req.session.currentUser = currentUser;
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            res.status(500).json({ message: "登录失败，请重试" });
            return;
          }
          console.log("Session saved:", req.session);
          console.log("Cookies:", req.headers.cookie);
          res.json(currentUser);
        });
      } else {
        res.status(401).json({ message: "用户名或密码错误" });
      }
    } catch (error) {
      console.error("登录错误:", error);
      res.status(500).json({ message: "登录失败，请重试" });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "请先登录" });
        return;
      }
      userId = currentUser._id;
    }
    try {
      const courses = courseDao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (error) {
      console.error("获取课程列表错误:", error);
      res.status(500).json({ message: "获取课程列表失败" });
    }
  };
  app.get("/api/users/:userId/courses", requireLogin, findCoursesForEnrolledUser);

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "请先登录" });
      return;
    }
    try {
      const newCourse = courseDao.createCourse({
        ...req.body,
        author: currentUser._id
      });
      enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.json(newCourse);
    } catch (error) {
      console.error("创建课程错误:", error);
      res.status(500).json({ message: "创建课程失败" });
    }
  };
  app.post("/api/users/current/courses", requireLogin, createCourse);
}
