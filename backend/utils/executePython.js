const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executePython = (filePath, inputFilePath, timeLimit) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    if (inputFilePath && !fs.existsSync(inputFilePath)) {
      return reject(new Error(`Input file not found: ${inputFilePath}`));
    }

    const command = inputFilePath
      ? `python3 ${filePath} < ${inputFilePath.replace(/\s+/g, " ")}`
      : `python3 ${filePath}`;

    exec(command, { timeout: timeLimit }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed || error.signal === "SIGTERM") {
          return reject(
            new Error(
              "Execution failed: Time Limit Exceeded. The script took too long to execute."
            )
          );
        }

        const errorMessage =
          stderr || error.message || "Unknown execution error.";
        console.error("Execution Error Details:", {
          command,
          error: error.message,
          stderr,
        });
        return reject(new Error(`Execution failed: ${errorMessage}`));
      }

      resolve(stdout.trim());
    });
  });
};

module.exports = executePython;