import bodyParser from "body-parser"
import express  from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import path from "path"
import { fileURLToPath } from "url"
import morgan from "morgan"
import { ftruncate } from "fs"
import { error } from "console"
import {register} from "./controllers/auth.js"

// CONFIGURATONS----------------------------------------

const __filename = fileURLToPath(import.meta.url)
//import.meta.url is a property available in ES6 modules that provides the URL of the current module. 
//The fileURLToPath function is a method of the url module that can be used to convert a file URL to a path.

const __dirname = path.dirname(__filename)
//The path.dirname method is a method of the path module that can be used to get the directory name of a given path. In this case, 
//it is being called with __filename as an argument, which is the path of the current module 
//(as defined in the previous line of code you provided).

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({policy : "require-corp"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit : "30mb",extended : true}));
app.use(bodyParser.urlencoded({limit : "30mb",extended : true}));
app.use(cors());
app.use("assets", express.static(path.join(__dirname,'public/assets')));

//FILE STORAGE ------------------------

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, "public/assets" )
    },
    filename : function(req,file,cb){
        cb(null,file.originalname)
    }
});

//This code snippet sets up a storage engine for `multer`, a middleware for handling `multipart/form-data`, 
//which is used for uploading files. The `destination` function specifies the folder where the uploaded files will be stored 
//and the `filename` function specifies the name of the file within the destination. In this case, 
//the original name of the uploaded file is used as the filename.

const upload = multer({storage})
//This line of code creates an instance of multer, a middleware for handling multipart/form-data, 
//which is used for uploading files. The storage option specifies the storage engine to use for uploaded files. 
//In this case, it’s using the storage object that was defined earlier in your code.

//------------------ROUTES WITH FILES--------------------

app.post("/auth/register",upload.single('picture'),register);


//------------------MONGOOSE SETUP--------------------

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,    
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port : ${PORT}`)) 
}).catch((error)=>console.log(`${error} did not connect `))