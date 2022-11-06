
import { v4 as uuidv4 } from 'uuid';

import Post from "../models/Post.js";
import client from '../db.js';
import encrypt from '../service/cryptopass.js';
import TokenSer from '../service/tokenServ.js';

import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import reactionsSepar from '../service/reactionsSepar.js';

class PostController {
    async AllPosts (req, res, next) {
        try {
            const queryText = "SELECT * FROM posts";
            const postsArr = await client.query(queryText);

            const postsIdArr = postsArr.rows.map(post => post.id);

            let postsReactionsArr = [];
            let postsCommentsArr = [];
            for (const postId of postsIdArr) {
                const DBReactionsArr = await Like.getAllLikesForEntity(postId);
                const DBCommentsArr = await Comment.CommentData("post_id", postId);

                if (!DBReactionsArr) {
                    postsReactionsArr.push({
                        id: postId,
                        likes: [],
                        dislikes: []
                    });
                } else {
                    let likesArr = [], dislikesArr = [];
                    for (const reaction of DBReactionsArr) {
                        if (reaction.type === true) {
                            likesArr.push(reaction);
                        } else {
                            dislikesArr.push(reaction);
                        }
                    }
                    postsReactionsArr.push({
                        id: postId,
                        likes: likesArr,
                        dislikes: dislikesArr
                    });
                }

                if (!DBCommentsArr) {
                    postsCommentsArr.push(0);
                } else {
                    postsCommentsArr.push(DBCommentsArr.length);
                }
            }

            res.status(200);
            res.json({ message: "Got posts list!", postsArr: postsArr.rows, postsReactionsArr: postsReactionsArr, postsCommentsArr: postsCommentsArr });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR IN AllPosts 1" + e);

            next(e);
        }
    }
    async PostId (req, res, next) {
        try {
            const { post_id } = req.params;
            let postData = await Post.PostData("id", post_id);
            postData["author_name"] = (await User.getUserData("id", postData.author_id)).full_name;
            
            const reactions = await Like.getAllLikesForEntity(postData.id);
            const postsReactionsArr = reactionsSepar(reactions, postData.id);

            const comments = await Comment.CommentData("post_id", postData.id);
            let commentsReactionsArr = [];
            for (let i = 0; i < comments.length; i++) {
                comments[i]["author_name"] = (await User.getUserData("id", comments[i].author_id)).full_name;
                commentsReactionsArr.push(reactionsSepar(await Like.getAllLikesForEntity(comments[i].id), postData.id));
            }

            res.status(200);
            res.json({ message: "Got post data!", postData: postData, reactions: postsReactionsArr, comments: comments, commentsReactions: commentsReactionsArr });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR IN PostId 2 " + e);

            next(e);
        }
    }
    async AllCategoriesIdPost (req, res, next) {
        try {
            const { post_id } = req.params;

            const queryText = "SELECT * FROM categories WHERE post_id = $1";
            const queryValues = [post_id];
            const data = await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "Got categories list for provided post id!", post_id: post_id, comments_list: data });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR AllCategoriesIdPost 3" + e);

            next(e);
        }
    }
    
    async createPost (req, res, next) {
        try {
            
            const chainikData = await Post.addPost(req.body);

            res.status(201);
            res.json({ message: "Post created!", post_id: chainikData });

        } catch (e) {
           
            console.log("ERROR createPost 4 " + e);

            next(e);
        }
    }

    async updatePostId (req, res, next) {
        try {
            const { post_id } = req.params;

            console.log("data length is: " + Object.keys(req.body).length);

            let queryText = "UPDATE posts SET ";
            let queryValues = [];
            let i = 1;
            for (let column in req.body) {
                queryText = queryText.concat(column);
                queryText = queryText.concat(" = $");
                queryText = queryText.concat(i);
                queryValues.push(req.body[column]);

                if (i === Object.keys(req.body).length) {
                    queryText = queryText.concat(" ");
                } else {
                    queryText = queryText.concat(", ");
                }

                i++;
            }
            queryText = queryText.concat("WHERE id = $");
            queryText = queryText.concat(i);
            queryValues.push(post_id);

            console.log(queryText);
            console.log(queryValues);

            const res = await client.query(queryText, queryValues);
            console.log(res);
    

            res.status(200);
            res.json({ message: "Post data has been updated!" });

        } catch (e) {
      
            console.log("ERROR IN updatePostId 5 " + e);

            next(e);
        }
    }
    async deletePostById (req, res, next) {
        try {
            const { post_id } = req.params;
            const queryText = "DELETE FROM posts WHERE id = $1";
            const queryValues = [post_id];

            const res2 = await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "Post data has been deleted!" });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR IN deletePostById 6" + e);

            next(e);
        }
    }
    
    async AllCommentsGet (req, res, next) {
        try {
            const { post_id } = req.params;
            const queryText = "SELECT * FROM comments WHERE post_id = $1";
            const queryValues = [post_id];
            const data = (await client.query(queryText, queryValues)).rows;
            
            for (let i = 0; i < data.length; i++) {
                data[i]["author_name"] = (await User.getUserData("id", data[i].author_id)).full_name;
            }

            res.status(200);
            res.json({ message: "Got comments list", post_id: post_id, comments_list: data });

        } catch (e) {
            console.log("ERROR AllCommentsGet 7 " + e);

            next(e);
        }
    }
    async createCommentPost (req, res, next) {
        try {
            const { post_id } = req.params;
            const { author_id, content } = req.body;

            // const tokenData = tokenService.tokenVerify(token);
            const id = uuidv4();
            
            const queryText = "INSERT INTO comments"+ 
            "(id, author_id, post_id, publish_date, content) " + 
            "VALUES ($1, $2, $3, $4, $5)";

            const publish_date = new Date();

            const queryValues = [id, author_id, post_id, publish_date, content];
            
            const data = await client.query(queryText, queryValues);

            res.status(201);
            res.json({ message: "Created new comment!" });


        } catch (e) {
           
            console.log("ERROR createCommentPost 8 " + e);

            next(e);
        }
    }
    async AllLikesPostGet (req, res, next) {
        try {
            const { post_id } = req.params;
            const data = await Post.LikesDataRows(post_id);

            res.status(200);
            res.json({ message: "Got likes list for provided post id!", post_id: post_id, likes_list: data });

        } catch (e) {
            // THROW AN API ERROR
            console.log("Error AllLikesPostGet 9  " + e);

            next(e);
        }
    }

    
    async createLike (req, res, next) {
        try {
            const { post_id } = req.params;
            const { author_id, type } = req.body;

            const data = await Post.Likeadd({ entity_id:post_id, author_id:author_id, type:type });

            res.status(201);
            res.json({ message: "Added like successfully!", id: data });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR createLike 10 " + e);

            next(e);
        }
    }
    async changeLike (req, res, next) {
        try {
            const { like_id, type } = req.body;

            await Post.LikeChange({ like_id: like_id, type: type });

            res.status(201);
            res.json({ message: "Changed like successfully!" });

        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR createLike 10 " + e);

            next(e);
        }
    }
    async deleteLikeForPostId (req, res, next) {
        try {
            const { post_id } = req.params;

            const queryText = "DELETE FROM like_post WHERE entity_id = $1";
            const queryValues = [post_id];

            await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "Like has been deleted!" });

        } catch (e) {
            // THROW AN API ERROR
            console.log("PIZDA POST CONTROLLERY deleteLikeForPostId " + e);

            next(e);
        }
    }



}

export default new PostController();