import { v4 as uuidv4 } from 'uuid';
import client from '../db.js';

class Like {
    async createLike(data) {
        try {
            // Create an random id for comment
            const id = uuidv4();
            const queryText = "INSERT INTO like_post"+ 
            "(id, author_id, entity_id, type) " + 
            "VALUES ($1, $2, $3, $4)";

            const queryValues = [id, data.author_id, data.entity_id, data.type];
            await client.query(queryText, queryValues);
            
            return id;
        } catch (e) {
            console.log("LIKES DB createLike: " + e);
        }
    }

    async getAllLikesForEntity(entity_id) {
        try {
            const queryText = "SELECT * FROM like_post WHERE entity_id = $1";
            const queryValues = [entity_id];
            const data = await client.query(queryText, queryValues);

            if (data.rowCount === 0) {
                return null;
            }

            return data.rows;
            
        } catch (e) {
            // THROW AN API ERROR
            console.log("CATEGORIES DB getAllLikesForPost: " + e);
        }
    }

    async deleteLikeById(id) {
        try {
            // Build a query using requested column
            const queryText = "DELETE FROM like_post WHERE id = $1";
            const queryValues = [id];

            const res = await client.query(queryText, queryValues);
            return res;
            
        } catch (e) {
            // THROW AN API ERROR
            console.log("POST DB getAllPosts: " + e);
        }
    }
}

export default new Like();
