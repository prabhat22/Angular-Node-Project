const multer=require('multer');
const MimeType={
  "image/png":'png',
  "image/jpeg":'jpg',
  "image/jpg":'jpg'
}
const storage=multer.diskStorage(
  {
    destination:(req,file,cb)=>
    {
      const isValid=MimeType[file.mimetype];
      let error=new Error("invalid file");
      if(isValid)
      {
        error=null;
      }

      cb(error,"backend/images");
    },
    filename:(req,file,cb)=>
    {
      const name=file.originalname.split(" ").join('-');
      const ext=MimeType[file.mimetype];
      cb(null,name+"-"+Date.now()+"."+ext)
    }
  }
)

module.exports=multer({storage:storage}).single('image');
