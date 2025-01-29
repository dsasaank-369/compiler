const Submission = require("../models/submissionModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getSubmissionByUserID = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  // Verify that userId is being used correctly
  console.log(`Fetching submissions for user ID: ${userId}`);

  // Populate the problemId field to get the problem details
  const submissions = await Submission.find({ userId }).populate(
    "problemId",
    "title"
  );

  if (!submissions || submissions.length === 0) {
    return next(new AppError("No submissions found for the given user", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      submissions,
    },
  });
});