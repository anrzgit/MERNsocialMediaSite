import express  from "express"
import {login} from "../controllers/auth.js"

const router = express.Router();
//A router object is an instance of middleware and routing system in Express.
// You can use it to define multiple routes with different HTTP methods and middleware functions that handle requests to those routes.

//auth/login
//using router object to define a route for POST requests to the /login endpoint.
//using router intead of app because we want to use the router in index.js
router.post("/login",login);

export default router;