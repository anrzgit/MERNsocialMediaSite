import  express  from "express";
import { getUsers,addRemoveFriends,getUserFriends } from "../controllers/user.js";
import {verifyToken} from "../middleware/auth.js"

const router = express.Router();

//------------------READ----------------------
router.get("/:id",verifyToken,getUsers);
router.get("/:id/friends/:userId",verifyToken,getUserFriends);

//------------------UPDATE--------------------
router.patch("/:id/:friendId",verifyToken,addRemoveFriends);

export default router;