const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const postRoutes=require('./routes/posts');
const userRoutes=require('./routes/user');

mongoose.connect("mongodb+srv://username:password@cluster0-8gluj.mongodb.net/test"
  ).then(()=>
  {
    console.log("connect to database");
  }).catch((err)=>
  {
    console.log(err);
    console.log("connect failure to database");
  })

const bodyParser=require('body-parser');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/images',express.static(path.join('backend/images')))

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports=app;
