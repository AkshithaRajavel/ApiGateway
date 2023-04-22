const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const AppPorts = require('./AppRegistry');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({
    extended: true
  }));
//middleware
function mid(req,res,next){
    req.url = '/'+req.cookies['AppName']+req.url;
    next();
}
//route handler
app.get('/setApp',(req,res)=>{
    res.sendFile('C:\\Users\\AKSHITHA\\Desktop\\wise_works\\Gateway\\index.html');
})
app.get('/setApp/:AppName',(req,res)=>{
    const AppName = req.params.AppName;
    if(AppName in AppPorts.Apps){
    res.cookie('AppName',AppName);
    res.redirect('/');}
    else{
        res.send("<h1>404 Not Found</h1>")
    }
})
app.use('/',mid);
for(var App in AppPorts.Apps)
app.use(`/${App}`,proxy(`http://127.0.0.1:${AppPorts.Apps[App]}`));
//start gateway
port = process.argv[2];
app.listen(port,()=>console.log(`Apigateway started on port ${port}`));