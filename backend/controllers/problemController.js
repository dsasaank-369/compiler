const Problem = require("../models/problemModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllProblems = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Problem.find().populate("testCases"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const problems = await features.query;
// const problems = await Problem.find();

  res.status(200).json({
    status: "success",
    results: problems.length,
    data: {
      problems,
    },
  });
});

exports.getProblem = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return next(new AppError("Problem not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        problem,
      },
    });
  }
});

exports.createProblem = catchAsync(async (req, res, next) => {
  const problem = await Problem.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      problem,
    },
  });
});

exports.updateProblem = catchAsync(async (req, res, next) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!problem) {
    return next(new AppError("Problem not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      problem,
    },
  });
});

exports.deleteProblem = catchAsync(async (req, res, next) => {
  const problem = await Problem.findByIdAndDelete(req.params.id);

  if (!problem) {
    return next(new AppError("Problem not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});