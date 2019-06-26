const Post=require('../post');
exports.createPost=(req,res)=>
{
  const url=req.protocol+"://"+req.get('host');
  const post=new Post(
    {

      title:req.body.title,//sG3aoaakfeYQi6xW
      desc:req.body.desc,
      imgPath:url+"/images/"+req.file.filename,
      creator:req.userData.userId
    }
  )
  console.log(post);
  post.save().then(result=>
  {
    console.log("result is:",result)
    res.status(201).json({msg:"Post add successfully",
    post:{
      ...result,
    _id:result._id
   }
  });
  });
}
exports.getPost=(req,res)=>
{
 console.log("get api called");
 const pageSize=+req.query.pageSize;
 const pageNo=+req.query.pageNo;
 const postQuery=Post.find();
 let fetchPost;

 if(pageNo && pageSize)
 {
   postQuery.skip(pageSize*(pageNo-1)).limit(pageSize)
 }
       postQuery.then((result)=>
      {

           console.log(result);
           fetchPost=result;
           return Post.count();
       }).then((count)=>
       {

        res.status(200).json(
          {
            msg:"pst fetched successfully",
            posts:fetchPost,
            maxCount:count
          }
        );
       })
}

exports.deletePost=(req,res,next)=>
{
  Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(
    (data)=>
    {
      console.log("delete data is:",data);
      if(data.n>0)
      {
        res.status(200).json({msg:"post deleted"})
      }
      else{
        res.status(401).json({msg:"unauthorized user"})
      }


    }
  )
}
exports.getPostById=(req,res,next)=>
{
  Post.findById(req.params.id).then((post)=>
  {
    if(post)
    {
      res.status(200).json(post);
    }
    else{
      res.status(404).json({msg:"no post found"});
    }
  })
}
exports.updatePost=(req,res,next)=>
{
  console.log("router update");
  let imgPath=req.body.imgPath;
  if(req.file)
  {
    const url=req.protocol+"://"+req.get('host');
    imgPath=url+"/images/"+req.file.filename
  }

  const post=new Post(
    {
      _id:req.params.id,
      title:req.body.title,
      desc:req.body.desc,
      imgPath:imgPath,
      creator:req.userData.userId
    })

  Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then((data)=>
  {
    console.log(data);
    if(data.n>0)
    {
      res.status(200).json({msg:"post update successfully"})
    }
    else{
      res.status(401).json({msg:"unauthorized user"})
    }

  })
}
