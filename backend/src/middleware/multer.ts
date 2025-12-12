import multer from "multer";
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";
    const host = req.hostname;
    
    if (host === "localhost" || host === "127.0.0.1") {
      uploadPath = "uploads/";
      console.log(uploadPath);
    } else {
      uploadPath = path.join("data");
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log("Entered!!!!")
    }
    cb(null, uploadPath);
  },
  
 
});
export const upload = multer({ storage });
