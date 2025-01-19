const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const folder = path.join(__dirname, "codes");

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

const generateFile = async (language, code) => {
    let filename;

    if (language == 'java') {

            const classNameMatch = code.match(/public\s+class\s+(\w+)/);
            if (!classNameMatch) {
                throw new Error("Invalid Java code: No public class found");
            }
            filename = `${classNameMatch[1]}.java`;
    }
    else {
        const extensions={
            cpp:"cpp",
            javascript:"js",
            python:"py"
    
        }
        const jobID = uuidv4();
         filename = `${jobID}.${extensions[language]}`;//id.cpp
        
    }
    
    console.log(filename);
    
    const filepath = path.join(folder, filename);
    await fs.writeFileSync(filepath, code);
    return filepath;
}

module.exports = generateFile;