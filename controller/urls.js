const shortid = require("shortid");
const URL = require("../Module/urls");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  const user=req.userId
  
 
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  const urls=await URL.create({
    userId:user,
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  const yourUrls=req.protocol+'://'+req.get('host')+'/urls/redirect?shortId='+urls.shortId
  return res.render('home',{   
    yourUrls:yourUrls,
    active:"home"
  })
 
  // try {
  //   const userUrls=await URL.find({userId:user})

  //   return res.send(userUrls)
  // } catch (error) {
  //   return res.send(error)
  // }
 
}

async function handleGetAnalytics(req, res) {
  const shortId = req.query.shortId
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
async function redirectTo(req, res)
{
  
  const entry = await URL.findOneAndUpdate(
    {
      shortId:req.query.shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
 
  if(!entry)
  {
      return res.send("Not found")
  }
  res.redirect(entry.redirectURL)
  
}
async function userCreated(req,res)
{
    const userId=req.userId
    
    
    
    
    try {
        const userUrls=await URL.find({userId:userId})
        
        const proto=req.protocol+'://'+req.get('host')+'/urls/redirect?shortId='
        
        if(!userUrls)
        {
            return res.render('yourUrls',{
              value:"",
              active:true
            })
        }
        
        return res.render('yourUrls',
        {
          value:userUrls,
          proto:proto,
          active:"yourUrls"
          
          
        })
        
    } catch (error) {
        return res.send(error)
    }
    
}
async function urlsDelete(req,res)
{
    const urlsId=req.paramas.id
    
    
    
    try {
        
      const deleteUrl=await URL.findByIdAndDelete({_id:id})
        return res.redirect('/yourUrls')
        
        
    } catch (error) {
        return res.send(error)
    }
    
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  redirectTo,
  userCreated,
  urlsDelete
};
