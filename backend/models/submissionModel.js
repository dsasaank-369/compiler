const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: [true, "Code is required"],
  },
  language: {
    type: String,
    enum: ["javascript", "python", "java", "cpp"],
    required: [true, "Programming language is required"],
  },
  results: [
    {
      input: { type: String },
      expectedOutput: { type: String },
      output: { type: String },
      isPassed: { type: Boolean },
    },
  ],
  passedCount: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  verdict: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
