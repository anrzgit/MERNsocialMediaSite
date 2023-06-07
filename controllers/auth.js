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
        
    }
}