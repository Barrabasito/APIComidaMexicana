const express = require("express");
const bodyParser = require("body-parser");

const app=express();
const PORT = process.env.MYSQLPORT || 3977;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
res.send({msg:"Hola Mundo"});
});

app.post("/welcome",(req,res)=>{
const{username}=req.body;
res.status(200).send({msg:`Hola, ${username}`});
});

app.listen(PORT,()=>{
    console.log("Servidor express escuchando en el puerto " + PORT);
});
