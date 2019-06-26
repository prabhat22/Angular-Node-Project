const User=require('../user');
const pwdHash=require('password-hash')
const jwt=require('jsonwebtoken');

exports.createUser=
(req,res,next)=>
{
   const hash=pwdHash.generate(req.body.pwd);
   const user=new User(
    {
      email:req.body.email,
      pwd:hash
    }
   );

   console.log("user is",user)

 user.save().then((result)=>
 {
   res.status(201).json(
     {
       msg:"user add successfully",
       data:result
     }
   )
 }).catch((err)=>
 {
   res.status(500).json(
     {
       msg:"Invalid credentials"
     }
   )
 })
};
exports.loginUser=
(req,res,next)=>
{
  let fetchedUser;
  User.findOne({email:req.body.email}).then((user)=>
  {
    console.log("router email is:",req.body.email);
    console.log(" router user is:", user);
    if(!user)
    {
       return res.status(404).json({msg:"No user with this email is found"});

    }
    fetchedUser=user;
    return pwdHash.verify(req.body.pwd,user.pwd);

  }).then(result=>
    {
      console.log(result);
      if(!result)
      {
        return res.status(401).json({msg:"Password does'not match"})
      }
      const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},"secret key",{expiresIn:"1h"});
      console.log(token);
      res.status(200).json(
        {
          token:token,
          expiresIn:3600,
          userId:fetchedUser._id
        }
      )
    }).catch(err=>{
     // console.log(err)
      return res.status(401).json({
        msg:"authentication failed"
      })
    })
};
