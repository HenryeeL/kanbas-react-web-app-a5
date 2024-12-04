import Database from "../Database/index.js";
export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const alreadyEnrolled = enrollments.some(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
  if (!alreadyEnrolled) {
    enrollments.push({ _id: Date.now(), user: userId, course: courseId });
  } else {
    console.log("User is already enrolled in course");
  }
  return enrollments;
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.user !== userId || enrollment.course !== courseId
  );
  return Database.enrollments;
}

export function getEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}