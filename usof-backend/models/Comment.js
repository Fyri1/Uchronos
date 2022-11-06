import { v4 as uuidv4 } from 'uuid';

import client from '../db.js';

class Comment {
    async CommentData(providedDataColumn, providedData) {
        try {
            const queryText = "SELECT * FROM comments WHERE " + providedDataColumn + " = $1";
            const queryValues = [providedData];

            const res = await client.query(queryText, queryValues);

            if (res.rowCount === 0) {
                return [];
            }
            return res.rows;

        } catch (e) {
            console.log("ERROR CommentData: " + e);
        }
    }

    async AllLikesEntity(entity_id) {
        try {

            const queryText = "SELECT * FROM like_post WHERE entity_id = $1";
            const queryValues = [entity_id];
            const data = await client.query(queryText, queryValues);

            return data.rows;
            
        } catch (e) {

            console.log("ERROR AllLikesEntity: " + e);
        }
    }
    async addLike(data) {
        try {

            const id = uuidv4();
            
            const queryText = "INSERT INTO like_post"+ 
            "(id, author_id, entity_id, type) " + 
            "VALUES ($1, $2, $3, $4)";

            const queryValues = [id, data.author_id, data.entity_id, data.type];
            
            return await client.query(queryText, queryValues);
            
        } catch (e) {

            console.log("ERROR addLike: " + e);
        }
    }
    async updateCommentById (req, res, next) {
        try {
            const { category_id } = req.params;

            await Comment.setCommentData(req.body, category_id);

            res.status(200);
            res.json({ message: "Updated comment!!"});

        } catch (e) {

            console.log("ERROR updateCommentById" + e);

            next(e);
        }
    }

    async CommentDataPatch(data, comment_id) {
        try {
            const queryText = "UPDATE comments SET " + Object.keys(data)[0] + " = $1 WHERE id = $2";
            const queryValues = [data[Object.keys(data)[0]], comment_id]

            const res = await client.query(queryText, queryValues);

            if (res.rowCount === 0) {

            }
            return res.rows[0];
            
        } catch (e) {

            console.log("ERROR CommentDataPatch: " + e);
        }
    }


    
}
export default new Comment();