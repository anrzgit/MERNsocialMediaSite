import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


//-------------REGISTER USER --------------

export const register = async (req,res) => {
    try {
        //taking the values from the UI
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,    
        } = req.body;


        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,salt)
        //These two lines of code use the bcrypt library to generate a salt and hash a password. 
        //The bcrypt.genSalt function generates a new salt, which is a random string used to add complexity to the hashing process.
        // The bcrypt.hash function takes the plain text password and the salt as arguments and returns a hashed version of the password.

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile : Math.floor(math.random()*10000),
            impressions : Math.floor(math.random()*10000),  
        })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

//--------Logging In ---------------------
export const login = async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email : email})
        if(!user) return res.status(400).json({ msg: "User doesn't exist" })

        const isMatch = await bcrypt.compare(password, user.password);
        //compare the password from the UI with the password in the database using bcrypt.compare for same salt

        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

        //sending the token to the UI
        const token = jwt.sign({ id : user._id},process.env.JWT_SECRET);
        //The jwt.sign function takes a payload and a secret key as arguments and returns a token.
        //The payload is an object containing the user’s id.
        //The secret key is a string used to sign the token, which is used to verify that the token was created by your server and not by an attacker.
        //The secret key is stored in the .env file, which is not committed to the repository.
        //The token is sent to the client and stored in local storage.
        //The token is sent to the server in the Authorization header of requests.
        //The server uses the secret key to verify that the token was created by your server and not by an attacker.
        //If the token is valid, the server extracts the user’s id from the payload and uses it to find the user in the database.
        //The user is stored in req.user and can be accessed in any route handler that uses the verifyToken middleware.
        delete user.password;
        res.status(200).json({token,user});


        } catch (error) {
        res.status(500).json({error : error.message})
    }
}