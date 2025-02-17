const path=require("path")

const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const executeCpp = require('./utils/executeCPP')
const inputfile = require('./utils/inputFile');
const { executeJava } = require('./utils/executeJava');
const { executeJavascript } = require('./utils/executeJavascript');
const { executePython } = require('./utils/executePython');
const generateFile = require('./utils/generatefile');
const userRouter = require("./routes/userRoutes");
const  problemRoutes  = require('./routes/problemRoutes');
const  testcaseRouter  = require('./routes/testcaseRoutes');
const submissionsRouter = require("./routes/submissionsRoutes.js");

const app=express();

app.use(cors());
require('dotenv').config();
const port=process.env.PORT || 5001;


const _dirname=path.resolve();
console.log(_dirname);


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/problems", problemRoutes);

// app.get("/",(req,res)=>{
//     res.send("Hello World!");
// });

mongoose.connect(process.env.connect_db).then((result)=>{ 
  console.log("DB connected");
}).catch(err=>{
  console.log(err);
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/testcase", testcaseRouter);
app.use("/api/v1/submissions", submissionsRouter);

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
app.use(express.static(path.join(_dirname,"/frontend/build")));
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","build","index.html"));
} )

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    
});

