const express=require('express');
const cors=require('cors');

const generateFile = require('./generatefile');
const executeCpp = require('./executeCPP');
const inputfile = require('./inputFile');


const app=express();
app.use(cors());



app.use(express.json());
app.use(express.urlencoded({extended:true}));


require('dotenv').config();
const port=process.env.PORT || 5001;


app.get("/hello",(req,res)=>{
    res.send("Hello World!");
});

app.post("/run",async(req,res)=>{
    const{language='cpp', code, input}=req.body;
    console.log(input);
    
    if(code==undefined) return res.status(400).json({error:"No code provided"});

    try {
        const filepath= await (generateFile(language, code));
        console.log(filepath);
        
        const inputpath= await (inputfile(input));
        console.log(inputpath);
        

        const output=await(executeCpp(filepath, inputpath));
        return res.json({filepath, output, inputpath});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }

});

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    
});
