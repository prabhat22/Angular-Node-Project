const express=require('express');

const router=express.Router();
const checkAuth=require('../middleware/check');
const extractFile=require('../middleware/file');
const PostController=require('../controller/post');

router.post('',checkAuth,extractFile,PostController.createPost)
router.get('',PostController.getPost);
router.delete('/:id',checkAuth,PostController.deletePost);
router.get('/:id',checkAuth,PostController.getPostById)
router.put('/:id',checkAuth,extractFile,PostController.updatePost)

module.exports=router;
