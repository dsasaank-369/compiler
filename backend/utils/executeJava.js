const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const folder=path.join(__dirname,'outputs');
if(!fs.existsSync(folder)){
    fs.mkdirSync(folder);
}

const executeJava = (filePath, inputFilePath, timeLimit) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    if (inputFilePath && !fs.existsSync(inputFilePath)) {
      return reject(new Error(`Input file not found: ${inputFilePath}`));
    }

    const fileName = path.basename(filePath, ".java");
    const dir = path.dirname(filePath);

    const command = `${inputFilePath ? `javac ${filePath} && java -cp ${dir} ${fileName} < ${inputFilePath}` : `javac ${filePath} && java -cp ${dir} ${fileName} `};`;
    exec(command, { timeout: timeLimit }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed || error.signal === "SIGTERM") {
          return reject(
            new Error(
              "Time Limit Exceeded: The script took too long to execute."
            )
          );
        }

        console.error("Execution Erroryo:", error.message);
        console.error("Standard Error Output:", stderr);
        return reject(
          new Error(stderr || error.message || "Error executing Java code.")
        );
      }

      resolve(stdout.trim());
      
    });
  });
};

module.exports = executeJava;