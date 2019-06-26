const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator') // third party package to uniquely store email
 const userSchema=mongoose.Schema(
  {
    email:{type:String,require:true,unique:true},
    pwd:{type:String,require:true}
  }
);
userSchema.plugin(uniqueValidator);
module.exports=mongoose.model('User',userSchema);