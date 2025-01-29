const express = require("express");

const testcaseController = require("../controllers/testcaseController");


const router = express.Router();

router
  .route("/")
  // .get(testcaseController.getAllTestCases)
  .post(
    // authController.protect,
    // authController.restrictTo("admin"),
    testcaseController.createTestCase
  );

// router
//   .route("/:id")
//   .get(problemController.getProblem)
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin"),
//     problemController.updateProblem
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin"),
//     problemController.deleteProblem
//   );

module.exports = router;