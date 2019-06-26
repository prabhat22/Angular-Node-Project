const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>
{
  try
  {
    console.log("check tokn call");
    const token=req.headers.authorization;
    console.log(token);
   const decodedToken= jwt.verify(token,"secret key");
   req.userData=
   {
     email:decodedToken.email,
     userId:decodedToken.userId
   }
    next();
  }
  catch(err)
  {
    console.log(err);
    res.status(401).json({msg:"Auth failed in checking "});
  }


}
