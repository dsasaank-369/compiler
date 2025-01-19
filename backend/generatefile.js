const path=require('path');
const fs=require('fs');
const { v4: uuidv4 } = require('uuid');

const folder = path.join(__dirname,"codes");

if(!fs.existsSync(folder)){
    fs.mkdirSync(folder,{recursive:true});
}

const generateFile=async(language, code)=>{
    const jobID=uuidv4();
    const filename=`${jobID}.${language}`;//id.cpp
    const filepath= path.join(folder,filename);
    await fs.writeFileSync(filepath, code);
    return filepath;
}

module.exports=generateFile;