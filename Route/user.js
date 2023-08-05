const express=require('express')
const {signInUser,logInUser,logout}=require('../controller/user')
const router=express.Router()

router.get('/resister',(req,res)=>
{
    return res.render('resister')
})

router.post('/resister',signInUser)

router.post('/login',logInUser)
router.get('/logout',logout)


module.exports=router