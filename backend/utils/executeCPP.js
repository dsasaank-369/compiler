const fs= require('fs');
const path=require('path');
const {exec}=require('child_process');

const folder=path.join(__dirname,'outputs');
if(!fs.existsSync(folder)){
    fs.mkdirSync(folder);
}

const executeCPP=(filepath, input)=>{
    //dirname/codes/id.cpp
    const jobid=path.basename(filepath).split(".")[0];//id
    const outputFileName=`${jobid}.out`;//id.out
    const outputPath=path.join(folder, outputFileName);//dirname/outputs/id.out

    return new Promise((resolve, reject)=>{
       exec(`g++ ${filepath} -o ${outputPath} && cd ${folder} && ./${outputFileName} < ${input}`,
        (error, stdout, stderr)=>{
            if(error){
                reject(new Error(`Error executing C++ code:${error}`));
            } 
            if(stderr){
                reject(new Error(`Error executing C++ code:${stderr}`));
            } 
            resolve(stdout);
       }) 
    })
}

module.exports=executeCPP;
