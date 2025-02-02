const path=require('path');
const fs=require('fs');
const { v4: uuidv4 } = require('uuid');

const folder = path.join(__dirname,"Inputs");

if(!fs.existsSync(folder)){
    fs.mkdirSync(folder,{recursive:true});
}

const inputfile=async(input)=>{
    const jobID=uuidv4();
    const filename=`${jobID}.out`;
    const filepath= path.join(folder,filename);
    await fs.writeFileSync(filepath, input);
    return filepath;
}

module.exports=inputfile;