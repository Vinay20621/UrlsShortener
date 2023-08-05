const Joi=require('joi')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const User=require('../Module/User')
const {signToken,verifyToken}=require('../Services/jwt')


async function signInUser(req,res)
{
    
    
    const schema=Joi.object({
        name:Joi.string().min(4).max(18).required(),
        username:Joi.string().alphanum().min(4).max(18).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(10).required(),
        comfermPassword:Joi.ref('password')
    })
    const {error}=schema.validate(req.body)
    if(error)
    {
        
        return res.render('resister',{
            error:error.message
        })
        
        
    }
    const {name,username, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {       

        return res.render('resister',{
            error:"Email already registered, use another email!"
        })
        
      }

      if (usernameInUse) {
        
        return res.render('resister',{
            error:"Username not available, choose another username!"
        })
        

        
      }
    } catch (error) {
        
        return res.render('resister',{
            error:error
        })
    }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db  
   
    try {
      const userToRegister = new User({
        name,
        username,
        email,        
        password: hashedPassword,
      });

      const user=await userToRegister.save();
     
    
     
     return res.redirect('/users/logout')
    
    }
    catch(e)
    {
        return res.send(e)
    }

}
async function logInUser(req,res)
{
    const {username,password}=req.body
    try {
        if(!username || !password)
        {
            return res.render("first",{
                error:"Given field required"
            })
           
        }
       const user= await User.findOne({username:username})
        if(!user)
        {
            return res.render("first",{
                error:"Incorrect User or Password "
            })
        }
        
        const varify=await bcrypt.compare(password,user.password)
        
        if(!varify)
        {
            
            return res.render("first",{
                error:"Incorrect User or Password "
            })
        }
        const token=signToken({userId:user._id},"30m")
        res.cookie("TOKEN",token)
        return res.render("home",{
            yourUrls:"",
            active:"home"
         })
    } catch (error) {
        return res.send(error)
    }
}
async function logout(req,res)
{
    res.clearCookie('TOKEN')
    return res.render("first",{ active:"logout"})
}
module.exports={signInUser,logInUser,logout}