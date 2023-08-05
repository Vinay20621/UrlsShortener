const { verifyToken} = require("../Services/jwt");

async function auth(req,res,next)
{
  
    // console.log(req.cookies.TOKEN)
    const token=req.cookies.TOKEN
    if(!token)
    {
      return res.send("first Login")
    }
    const isvalid=verifyToken(token)
    if(!isvalid)
    {
      return res.send("first Login")
    }
    req.userId=isvalid.userId
   
  
    next();
  

}

module.exports = auth
