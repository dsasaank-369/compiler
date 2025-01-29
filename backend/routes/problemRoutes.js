const express = require("express");
const problemController = require("../controllers/problemController");
// const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(problemController.getAllProblems).post(
  // authController.protect,
  // authController.restrictTo("admin"),
  problemController.createProblem
);

router
  .route("/:id")
  .get(problemController.getProblem)
  .patch(
    // authController.protect,
    // authController.restrictTo("admin"),
    problemController.updateProblem
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("admin"),
    problemController.deleteProblem
  );

module.exports = router;