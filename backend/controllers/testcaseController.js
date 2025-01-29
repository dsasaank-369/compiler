const TestCase = require("../models/testCaseModel");
const Problem = require("../models/problemModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");

exports.createTestCase = catchAsync(async (req, res, next) => {
  const { input, output, problemId } = req.body;

  console.log(problemId, input, output);

  // Validate `problemId` existence
  if (!problemId) {
    return next(
      new AppError("Problem ID is required to create a test case.", 400)
    );
  }

  // Validate `problemId` format
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    return next(new AppError("Invalid Problem ID.", 400));
  }

  // Check if the problem exists
  const problem = await Problem.findById(problemId);
  console.log(problem, problemId);
  if (!problem) {
    console.log(problem);
    return next(
      new AppError("Problem not found. Cannot create test case.", 404)
    );
  }

  // Validate input and output
  if (!input || !output) {
    return next(
      new AppError("Test case must have both input and output fields.", 400)
    );
  }

  // Create the test case and update the problem atomically
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create test case
    const testCase = await TestCase.create([{ problemId, input, output }], {
      session,
    });

    // Update the problem's `testCases` array
    await Problem.findByIdAndUpdate(
      problemId,
      { $push: { testCases: testCase[0]._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with success
    res.status(201).json({
      status: "success",
      data: testCase[0], // Return the created test case
    });
  } catch (err) {
    // Abort the transaction in case of any error
    await session.abortTransaction();
    session.endSession();
    return next(
      new AppError(`Failed to create test case: ${err.message}`, 500)
    );
  }
});

// exports.getAllTestCases = catchAsync(async (req, res, next) => {
//   // Use APIFeatures to handle filtering, sorting, and pagination
//   const features = new APIFeatures(TestCase.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const testCases = await features.query;

//   res.status(200).json({
//     status: "success",
//     results: testCases.length,
//     data: {
//       testCases,
//     },
//   });
// });