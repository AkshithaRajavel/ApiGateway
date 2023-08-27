//imports
const express = require('express');
const proxy = require('express-http-proxy');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const AppRegistry = require('./AppRegistry');

//express settings
const app = express();
app.set('views',__dirname);
app.set("view engine",'ejs');

//env variables
PORT = 80;
BASE_URL = "http://localhost"

//custom middleware and common handlers
const setApp = (req,res)=>{
    res.render('index',AppRegistry)
}
const home = (req,res,next)=>{
    if(req.cookies.AppName)req.url = '/'+req.cookies['AppName']+req.url;
    else req.url = '/setApp';
    next();
}
//middleware settings
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json())
app.use('/',home);
for(var App in AppRegistry.Apps)
app.use(`/${App}`,proxy(`${BASE_URL}:${AppRegistry.Apps[App]}`));

//route handler
app.get('/setApp',setApp)
app.post('/setApp',(req,res)=>{
    const project = req.body.project;
    if(project in AppRegistry.Apps){
        res.cookie("AppName",project);
        res.redirect('/');
    }
    res.status(404).send();
})

//start gateway
app.listen(PORT,()=>console.log(`Apigateway started on port ${PORT}`));