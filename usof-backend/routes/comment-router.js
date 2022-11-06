import  commController  from "../controllers/comments-controll.js";
import express from "express";



const router = express.Router();
router.get("/:comment_id", commController.CommentDataId);
router.get("/:comment_id/like", commController.LikesCommentId);

router.post("/:comment_id/like", commController.createLikeForCommentById);
router.patch("/:comment_id", commController.updateCommentPatch);
router.delete("/:comment_id", commController.deleteCommentId);
router.delete("/:comment_id/like", commController.deleteLikeComment);


  
export default router;
