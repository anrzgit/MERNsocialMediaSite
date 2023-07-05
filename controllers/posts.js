import User from "../models/user.js";
import Post from "../models/post.js";

//----------------create post----------------

export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
            //add post to user's posts
        const newPost = new Post({
            firstName : user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            userPicPath : user.picturePath,
            picturePath,
            likes : {},
            comments : [],
        });
        await newPost.save();

        
        //returning all posts
        const post = await post.find();
        res.status(201).json(post);

    } catch (error) {
        res.status(409).json({error : error.message})
    }
}

//-------------READ POSTS----------------

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({error : error.message})
    }
}

export const  getUserPost = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({error : error.message})
    }
}


//-------------UPDATE POST----------------

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId} = req.body;
        const post = await Post.findById(id);
        if(!post.likes[userId]){
            post.likes[userId] = true;
        }else{
            post.likes[userId] = false;
        }
        const updatedPosts = await findByIdAndUpdate(id,{
            likes : post.likes,},{new : true},
        );
        await post.save();
        res.status(200).json(updatedPosts);
    } catch (error) {
        res.status(404).json({error : error.message})
    }
}