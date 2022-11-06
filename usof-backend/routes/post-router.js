import express from "express";
import  postController  from "../controllers/post-controller.js";

const router = express.Router();

router.get("/", postController.AllPosts);//1
router.get("/:post_id", postController.PostId);//2
router.get("/:post_id/categories", postController.AllCategoriesIdPost);//3
router.post("/", postController.createPost);//4
router.patch("/:post_id", postController.updatePostId);//5
router.delete("/:post_id", postController.deletePostById);//6

router.get("/:post_id/comments", postController.AllCommentsGet);// 7
router.post("/:post_id/comments", postController.createCommentPost); // 8 

router.get("/:post_id/like", postController.AllLikesPostGet); // 9
router.post("/:post_id/like", postController.createLike);// 10
router.patch("/:post_id/like", postController.changeLike);// 11
router.delete("/:post_id/like", postController.deleteLikeForPostId);//12


export default router;