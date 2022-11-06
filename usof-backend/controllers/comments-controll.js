
import Comment from "../models/Comment.js";
import client from '../db.js';

class CommController {
    async CommentDataId (req, res, next) {
        try {
            const { comment_id } = req.params;

            const data = await Comment.CommentData("id", comment_id);

            res.status(200);
            res.json({ message: "Got comment data!", commentData: data });

        } catch (e) {
            console.log("PIZDA COMMENT CONTROLLERY getCommentDataById " + e);

            next(e);
        }
    }
    
    async LikesCommentId (req, res, next) {
        try {
            const { comment_id } = req.params;

            const data = await Comment.AllLikesEntity(comment_id);

            res.status(200);
            res.json({ message: "Got likes list!", likes_list: data });

        } catch (e) {
            console.log("PIZDA COMMENT CONTROLLERY getLikesForCommentById " + e);

            next(e);
        }
    }
    async createLikeForCommentById (req, res, next) {
        try {
            const { comment_id } = req.params;
            const { author_id, type } = req.body;
            await Comment.addLike({ entity_id:comment_id, author_id:author_id, type:type });
            
            res.status(201);
            res.json({ message: "Added like successfully!" });

        } catch (e) {
            console.log("PIZDA COMMENT CONTROLLERY createLikeForCommentById " + e);

            next(e);
        }
    }
    async updateCommentPatch (req, res, next) {
        try {
            const { category_id } = req.params;

            await Comment.CommentDataPatch(req.body, category_id);

            res.status(200);
            res.json({ message: "Updated comment!!"});

        } catch (e) {
            console.log("PIZDA COMMENT CONTROLLERY updateCommentById " + e);

            next(e);
        }
    }

    async deleteCommentId (req, res, next) {
        try {
            const { comment_id } = req.params;
            const queryText = "DELETE FROM comments WHERE id = $1";
            const queryValues = [comment_id];

            const res = await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "Deleted category!!"});

        } catch (e) {
            console.log("PIZDA COMMENT CONTROLLERY deleteCommentById " + e);

            next(e);
        }
    }

    async deleteLikeComment (req, res, next) {
        try {
            const { comment_id } = req.params;

            
            const queryText = "DELETE FROM like_post WHERE entity_id = $1";
            const queryValues = [comment_id];

            await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "Like has been deleted!" });

        } catch (e) {
        
            console.log("PIZDA COMMENT CONTROLLERY deleteLikeForCommentById " + e);

            next(e);
        }
    }


}

export default new CommController();
    