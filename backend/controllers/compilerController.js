const generateFile = require("../utils/generatefile");
const inputfile = require("../utils/inputFile")
const executeJavascript = require("../utils/executeJavascript");
const executePython = require("../utils/executePython");
const executeCpp = require("../utils/executeCPP");
const executeJava = require("../utils/executeJava");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Problem = require("../models/problemModel");
const Submission = require("../models/submissionModel");

const catchAsync = require("../utils/catchAsync");

exports.runCode = catchAsync(async (req, res, next) => {
    const {
        code,
        language,
        input = ""
    } = req.body;
    if (!code) return next(new Error("Please enter the code"));

    try {
        const filePath = await generateFile(language, code);
        let inputFilePath = await inputfile(input);
        let output;
        switch (language) {
            case "javascript":
                output = await executeJavascript(filePath, inputFilePath);
                break;
            case "python":
                output = await executePython(filePath, inputFilePath);
                break;
            case "cpp":
                output = await executeCpp(filePath, inputFilePath);
                break;
            case "java":
                output = await executeJava(filePath, inputFilePath);
                break;
            default:
                return next(new Error(`Unsupported language: ${language}`));
        }

        res.status(200).json({
            filePath,
            input,
            output
        });
    } catch (error) {
        console.error("Error during execution:", error.message);
        return res.status(500).json({
            status: "error",
            message: error.message || "Something went wrong during execution",
            stack: error.stack
        });
    }
});

exports.submitCode = catchAsync(async (req, res, next) => {
    const {
        code,
        language,
        problemId,
        userId, input
    } = req.body;

    console.log(req.body+"POST");

    if (!code || !language) {
        return next(
            new AppError("Please provide both the code and language.", 400)
        );
    }

    if (!problemId) {
        return next(new AppError("Problem ID is required.", 400));
    }

    const problem = await Problem.findById(problemId).populate("testCases");
    console.log(problem+"Prob");
    
    if (!problem) {
        return next(new AppError("Problem not found.", 404));
    }

    const filePath = await generateFile(language, code);

    let passedCount = 0;
    const results = [];

    if (!problem.testCases || problem.testCases.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "No test cases for this problem.",
        });
    }



    for (const testCase of problem.testCases) {
        const {
            input,
            output: expectedOutput
        } = testCase;

        try {

            const inputsDir = path.join(__dirname, "../utils/Inputs");

            if (!fs.existsSync(inputsDir)) {
                fs.mkdirSync(inputsDir, { recursive: true });
            }

            const inputFilePath = path.join(inputsDir, `input-${Date.now()}.txt`);
            fs.writeFileSync(inputFilePath, input, "utf-8");

            let executionResult;

            switch (language) {
                case "javascript":
                    executionResult = await executeJavascript(
                        filePath,
                        inputFilePath,
                        problem.timeLimit
                    );
                    break;
                case "python":
                    executionResult = await executePython(
                        filePath,
                        inputFilePath,
                        problem.timeLimit
                    );
                    break;
                case "cpp":
                    executionResult = await executeCpp(
                        filePath,
                        inputFilePath,
                        problem.timeLimit
                    );
                    break;
                case "java":
                    executionResult = await executeJava(
                        filePath,
                        inputFilePath,
                        problem.timeLimit
                    );
                    break;
                default:
                    throw new AppError(`Unsupported language: ${language}`, 400);
            }

            if (executionResult.trim() === expectedOutput.trim()) {
                passedCount++;
            }




            results.push({
                input,
                expectedOutput,
                output: executionResult.trim(),
                isPassed: executionResult.trim() === expectedOutput.trim(),
            });

        } catch (error) {
            console.error("Error during code execution:", error);
            return res.status(500).json({
                status: "error",
                message: error.message || "Something went wrong during execution",
                stack: error.stack
            });
        }

    }

    const accuracy =
        problem.testCases.length > 0 ?
            (passedCount / problem.testCases.length) * 100 :
            0;

    console.log(JSON.stringify({
        problemId: new mongoose.Types.ObjectId(problemId),
            userId: new mongoose.Types.ObjectId(userId),
            code,
            language,
            results,
            passedCount,
            accuracy,
            verdict: passedCount === problem.testCases.length ? "Accepted" : "Rejected",
    }) + " Submission");


        const submission =  await Submission.create({
            problemId: problemId,
            userId: userId,
            code,
            language,
            results,
            passedCount,
            accuracy,
            verdict: passedCount === problem.testCases.length ? "Accepted" : "Rejected",
        });
        console.log("End");
        
    
    
        res.status(200).json({
            status: "success"
            ,
            data: {
                submission,
            },
        });
    
});