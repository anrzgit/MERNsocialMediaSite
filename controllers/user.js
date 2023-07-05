import User from "../models/user.js";


export const getUsers = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);    
    }catch(error){
        res.status(404).json({error : error.message})
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(user.friends.map((id)=>{
            user.findById(id);
        }))
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation,location, picturePath})=>
        {
            return {_id, firstName, lastName, occupation,location, picturePath};
        })
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({error : error.message})
    }
}

export const addRemoveFriends = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id !== friendId);
            friend.friends = friend.friends.filter((id)=> id !== id);
            res.status(200).json("user has been removed from friends list");
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
            res.status(200).json("user has been added to friends list");
        }
        await user.save();
        await friend.save();
        
        const friends = await Promise.all(user.friends.map((id)=>{
            user.findById(id);
        }))
        const formattedFriends = friends.map(({_id, firstName, lastName, occupation,location, picturePath})=>
        {
            return {_id, firstName, lastName, occupation,location, picturePath};
        })
    } catch (error) {
        res.status(404).json({error : error.message})
    }
}
