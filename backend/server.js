const express=require('express');
const cors=require('cors');

const generateFile = require('./generatefile');
const executeCpp = require('./executeCPP')
const inputfile = require('./inputFile');
const { executeJava } = require('./executeJava');
const { executeJavascript } = require('./executeJavascript');
const { executePython } = require('./executePython');


const app=express();
app.use(cors());



app.use(express.json());
app.use(express.urlencoded({extended:true}));


require('dotenv').config();
const port=process.env.PORT || 5001;


app.get("/",(req,res)=>{
    res.send("Hello World!");
});

app.post("/run",async(req,res)=>{
    const{language='cpp', code, input}=req.body;
    console.log(input);
    
    if(code==undefined) return res.status(400).json({error:"No code provided"});

    try {
        const filePath= await (generateFile(language, code));
        console.log(filePath);
        
        const inputpath= await (inputfile(input));
        console.log(inputpath);
        

        let output;
        switch (language) {
            case "javascript":
              output = await executeJavascript(filePath, inputpath);
              break;
            case "python":
              output = await executePython(filePath, inputpath);
              break;
            case "cpp":
              output = await executeCpp(filePath, inputpath);
              break;
            case "java":
              output = await executeJava(filePath, inputpath);
              break;
            default:
              return next(new Error(`Unsupported language: ${language}`));
          }
        return res.json({filePath, output, inputpath});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }

});

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    
});
