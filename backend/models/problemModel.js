const mongoose = require("mongoose");
const validator = require("validator");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Problem title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Problem description is required"],
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
    required: [true, "Problem difficulty is required"],
  },
  topics: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Topics must be an array of strings",
    },
  },
  companies: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Companies must be an array of strings",
    },
  },
  hints: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Hints must be an array of strings",
    },
  },
  examples: {
    type: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Examples must be an array of objects with input and output",
    },
  },
  constraints: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Constraints must be an array of strings",
    },
  },
  testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestCase" }],
  timeLimit: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

problemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Problem", problemSchema);