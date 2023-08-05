const express=require('express')
const ejs=require('ejs')
// const router=require('./Route/user')
const path = require("path");
const userRoute = require("./Route/user");
const urlsRoute = require("./Route/urls");
const auth=require('./Middlewere/auth')
const mongodb=require('./connection')
const cookieParser=require('cookie-parser')
const {PORT}=require('./config/index')

const app=express()
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
mongodb()
// app.use(checkForAuthenticationCookie("TOKEN"))
app.get('/',(req,res)=>
{
    res.render("first")
})
app.use("/users", userRoute);
app.use("/urls",urlsRoute);


app.listen(PORT,(req,res)=>
{
    console.log(`server is running at ${PORT}`)
})