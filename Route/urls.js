const express=require('express')
const shortid = require("shortid");
const URL = require("../Module/urls");
const {handleGenerateNewShortURL,userCreated,redirectTo,urlsDelete}=require('../controller/urls')
const router=express.Router()
const auth=require('../Middlewere/auth')
const Contact=require('../Module/contact')

router.get('/',auth,(req,res)=>
{
    return res.render("home",{
        yourUrls:"",
        active:"home"
    })
})
router.post('/',auth,handleGenerateNewShortURL)

router.get('/redirect',redirectTo)
// router.get('/click',handleGetAnalytics)
router.get('/yourUrls',auth,userCreated)
router.get('/contact',(req,res)=>
{
  
  return res.render('contact',
  {active:"contact"})
})
router.post('/contact',async(req,res)=>
{
  const {name,email,message}=req.body
  if(!name || !email || !message)
  {
    return res.render("contact",{error:"given field require", active:"contact"})
  }
  try
  {
    await Contact.create({
      name:name,
      email:email,
      message:message
    })
    return res.render("contact",{
      success:"message has been send",
      active:"contact"
    })
  } catch(error)
  {
    console.log(error)
  }


})


router.get("/delete/:blogId",async(req,res)=>
{
  
  try {

    // console.log(req.params.blogId)
    const item=await URL.findOneAndDelete({_id:req.params.blogId})
    // if(!item)
    // {
      
    // }
    // if(!item)
    // {
    //   return res.redirect('/blog')
    // }
    // console.log("pppppppppppppppppppp")
    // await Comment.deleteMany({blogId:item._id})
    // console.log(a)
    // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmm")

    return res.redirect('/urls/yourUrls')
    
  } catch (error) {
    console.log(error)
  }

})



module.exports=router