import  jwt  from "jsonwebtoken";


export const verifyToken = async (req,res,next) => {
    ////verify the token from the UI with the token in the database using jwt.verify for different salt
    //jwt.verify takes the token and the secret key as arguments and returns the decoded token.
    //The decoded token is an object containing the payload, which in this case is the user’s id.
    //If the token is invalid, jwt.verify throws an error.
    //The try/catch block is used to catch the error and return a 500 status code.
    //If the token is valid, the decoded token is stored in the req.user property and the next function is called.
    //The next function is a callback function that calls the next middleware function in the stack.
    //In this case, the next middleware function is the getUser middleware function.
    //The getUser middleware function uses the user’s id to find the user in the database and store it in req.user.
    //The req.user property is used in the getUserFriends and addRemoveFriends middleware functions to find the user’s friends and add or remove friends.
    //The req.user property is also used in the getUser, getUserFriends, and addRemoveFriends route handlers to send the user’s data to the client.
    try {
        let token = req.header("Authorisation"); 
        
        if(!token) {
            return res.status(403).send("Access Denied")
        }
        if(token.startsWith("Bearer ") ) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET) 
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({error : error.messege })
    }
}
