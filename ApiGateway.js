const express = require('express');
const app = express();
const request = require('request')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const AppPorts = require('./AppRegistry')
app.use(cookieParser())
//route handler
app.get('/setApp',(req,res)=>{
    const AppName = req.query.AppName;
    console.log(AppName);
    if(AppName in AppPorts.Apps){
    res.cookie('AppName',AppName);
    res.redirect('/');}
    else{
        res.send("<h1>404 Not Found</h1>")
    }
})
delete axios.defaults.headers.common["Authorization"];
app.all('*',(req,res)=>{
    if(!req.cookies.AppName)return res.redirect('/setApp');
    const AppName = req.cookies.AppName;
    request('http://127.0.0.1:'+AppPorts.Apps[AppName]+req.path,
    (error,response,body)=>{
        res.set(response.headers);
        res.send(body);
    });
})
//start gateway
port = process.argv[2];
app.listen(port,()=>console.log(`Apigateway started on port ${port}`));