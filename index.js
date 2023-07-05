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
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js"

 

// CONFIGURATONS----------------------------------------

const __filename = fileURLToPath(import.meta.url)
//import.meta.url is a property available in ES6 modules that provides the URL of the current module. 
//The fileURLToPath function is a method of the url module that can be used to convert a file URL to a path.

const __dirname = path.dirname(__filename)
//The path.dirname method is a method of the path module that can be used to get the directory name of a given path. In this case, 
//it is being called with __filename as an argument, which is the path of the current module 
//(as defined in the previous line of code you provided).

dotenv.config();
//dotenv.config() is a function from the dotenv package, 
//which is a zero-dependency module that loads environment variables from a .env file into process.env
const app = express();
app.use(express.json());
//express.json() is a built in middleware function in Express starting from v4.16.0. 
//It parses incoming JSON requests and puts the parsed data in req.body.

app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({policy : "require-corp"}));
app.use(morgan("common"));
//morgan is used to log HTTP requests in an Express app. It can help with debugging and monitoring by providing 
//information about incoming requests, such as the request method, URL, response status, and response time. 
//The common format is one of several predefined log formats that can be used with morgan. It outputs the standard Apache common log, which 
//includes information such as the remote IP address, request method, URL, response status code, and response size.

app.use(bodyParser.json({limit : "30mb",extended : true}));
app.use(bodyParser.urlencoded({limit : "30mb",extended : true}));
app.use(cors());
app.use("assets", express.static(path.join(__dirname,'public/assets')));

//--------------FILE STORAGE ------------------------

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

app.post("/auth/register",upload.single('picture'),verifyToken,register);
app.post("/post", verifyToken,upload.single('picture'),createPost);

//-------------------ROUTES---------------
app.use("/auth",authRoutes);
//That line of code mounts the authRoutes router on the /auth path of your main app. This means that any request to a path that starts with /auth will be handled by the authRoutes router.
//For example, if you have a route defined in authRoutes for the path /login, it will now be accessible in your main app at the path /auth/login

app.use("/users",userRoutes);
app.use("/posts",postRoutes);


//------------------MONGOOSE SETUP--------------------

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,    
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port : ${PORT}`)) 
}).catch((error)=>console.log(`${error} did not connect `))