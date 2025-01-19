const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJavascript = (filepath, inputFilePath, timeLimit = 10000) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return reject(new Error(`File not found: ${filepath}`));
    }

    if (inputFilePath && !fs.existsSync(inputFilePath)) {
      return reject(new Error(`Input file not found: ${inputFilePath}`));
    }

    const command = inputFilePath
      ? `node ${filepath} < ${inputFilePath}`
      : `node ${filepath}`;

    exec(command, { timeout: timeLimit }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed || error.signal === "SIGTERM") {
          return reject(
            new Error(
              "Time Limit Exceeded: The script took too long to execute."
            )
          );
        }

        console.error("Execution Error:", error.message);
        console.error("Standard Error Output:", stderr);
        return reject(
          new Error(stderr || error.message || "Error executing C++ code.")
        );
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = {
  executeJavascript,
};