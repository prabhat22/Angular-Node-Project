const express=require('express');
const router=express.Router();
const User=require('../user');
const pwdHash=require('password-hash')
const jwt=require('jsonwebtoken');
const userContoller=require('../controller/user');
router.post('/signup',userContoller.createUser);
router.post('/login',userContoller.loginUser);

module.exports=router;
