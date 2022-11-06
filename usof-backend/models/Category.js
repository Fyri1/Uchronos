import { v4 as uuidv4 } from 'uuid';

import client from '../db.js';


class Category {
    async CategoriesListGet() {
        try {

            const queryText = "SELECT * FROM categories";
            const data = await client.query(queryText);

            return data.rows;
            
        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR CategoriesListGet: " + e);
        }
    }
    async CategoryDataArrDB(providedDataColumn, providedData) {
        try {
            const queryText = "SELECT * FROM categories WHERE " + providedDataColumn + " = $1";
            const res = await client.query(queryText, [providedData]);

            if (res.rowCount === 0) {
                return null;
            }
            return res.rows[0];
        } catch (e) {

            console.log("ERROR CategoryDataArrDB: " + e);
        }
    }
    async CategoryAdd(data) {
        try {
           
            const id = uuidv4();
            
            const queryText = "INSERT INTO categories"+ 
            "(id, title, description) " + 
            "VALUES ($1, $2, $3)";

            const queryValues = [id, data.title, data.description];
            
            return await client.query(queryText, queryValues);
            
        } catch (e) {
            // THROW AN API ERROR
            console.log("ERROR CategoryAdd: " + e);
        }
    }
    async CategoryData(data, category_id) {
        try {
            const queryText = "UPDATE categories SET " + Object.keys(data)[0] + " = $1 WHERE id = $2";
            const queryValues = [data[Object.keys(data)[0]], category_id]
            const res = await client.query(queryText, queryValues);

            if (res.rowCount === 0) {

            }
            return res.rows[0];
        } catch (e) {

            console.log("ERROR CategoryData: " + e);
        }
    }
    async deleteCategory(category_id) {
        try {
            const queryText = "DELETE FROM categories WHERE id = $1";
            const queryValues = [category_id];
            const res = await client.query(queryText, queryValues);
            
        } catch (e) {

            console.log("ERROR deleteCategory: " + e);
        }
    }

}
export default new Category();