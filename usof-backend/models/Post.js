import { v4 as uuidv4 } from 'uuid';

import client from '../db.js';

class Post {
    
    async Likeadd(data) {
        try {
  
            const id = uuidv4();
            
            const queryText = "INSERT INTO like_post"+ 
            "(id, author_id, entity_id, type) " + 
            "VALUES ($1, $2, $3, $4)";

            const queryValues = [id, data.author_id, data.entity_id, data.type];
            
            await client.query(queryText, queryValues);
            return id;
            
        } catch (e) {
        
            console.log("CATEGORIES DB addLike: " + e);
        }
    }

    async LikeChange(data) {
        try {
            const queryText = "UPDATE like_post SET type = $1 WHERE id = $2";
            const queryValues = [data.type, data.like_id];

            const res = await client.query(queryText, queryValues);
            return res;
            
        } catch (e) {
            // THROW AN API ERROR
            console.log("POST DB getAllPosts: " + e);
        }
    }

    async PostData(providedDataColumn, providedData) {
        try {

            const queryText = "SELECT * FROM posts WHERE " + providedDataColumn + " = $1";
            const res = await client.query(queryText, [providedData]);
            
            if (res.rowCount === 0) {
                return null;
            }

            return res.rows[0];
        } catch (e) {
            console.log("POST DB getPostData: " + e);
        }
    }
    async addPost(data) {
        try {
            const id = uuidv4();
            
            const queryText = "INSERT INTO posts"+ 
            "(id, author_id, title, categories_id, publish_date, status, content) " + 
            "VALUES ($1, $2, $3, $4, $5, $6, $7)";

            const curDate =  new Date();

            const queryValues = [
                id,
                data.author_id,
                data.title,
                data.categories_id,
                curDate,
                true,
                data.content
            ]
            
            await client.query(queryText, queryValues);
            return id;
            
        } catch (e) {

            console.log("ERROR addPost: " + e);
        }
    }
    async LikesDataRows(entity_id) {
        try {
      
            const queryText = "SELECT * FROM like_post WHERE entity_id = $1";
            const queryValues = [entity_id];
            const data = await client.query(queryText, queryValues);

            return data.rows;
            
        } catch (e) {
           
            console.log("CATEGORIES DB getAllLikesForPost: " + e);
        }
    }



}
export default new Post();