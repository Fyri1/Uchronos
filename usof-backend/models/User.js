import client from '../db.js';

import UserDbError from '../exceptions/user-db-exceptions.js';

class User {
    async addUser(id, login, password, full_name, email, role, token) {
        try {
            const queryText = "INSERT INTO users" + 
            "(id, login, password, full_name, email, role, token) " + 
            "VALUES ($1, $2, $3, $4, $5, $6, $7)";

            if (!full_name) {
                full_name = 'ANONIMUS';
            }
            
            
            const kokon =  await client.query(queryText, [id, login, password, full_name, email, role, token]);
            console.log("kokon = ");
            console.log(kokon);

        } catch (e) {
            throw UserDbError.AddUserErrorsHandle(e, {id, login, password, full_name, email, role, token});
        }
    }

    async setUserData(providedDataColumn, providedData, user_id) {
        try {
            const queryText = "UPDATE users SET " + providedDataColumn + " = $1 WHERE id = $2";
            const res = await client.query(queryText, [providedData, user_id]);
            
        } catch (e) {
            console.log("ERROR setUserData: " + e);
        }
    }

    async getUserData(providedDataColumn, providedData) {
        try {
            const queryText = "SELECT * FROM users WHERE " + providedDataColumn + " = $1";
            
            const res = await client.query(queryText, [providedData]);
            if (res.rowCount === 0) {
                return null;
            }

            return res.rows[0];
        } catch (e) {
            console.log("ERROR getUserData: " + e);
        }
    }
    async getlistUsers() {
        try {
            const queryText = "SELECT * FROM users";
            const res = await client.query(queryText);
            
            return res.rows;
        } catch (e) {

            console.log("dolban Userov nema: " + e);
        }
    }
    async setUserData(data, user_id) {
        try {
            console.log("data length is: " + Object.keys(data).length);

            let queryText = "UPDATE users SET ";
            let queryValues = [];
            let i = 1;
            for (let column in data) {
                queryText = queryText.concat(column);
                queryText = queryText.concat(" = $");
                queryText = queryText.concat(i);
                queryValues.push(data[column]);

                if (i === Object.keys(data).length) {
                    queryText = queryText.concat(" ");
                } else {
                    queryText = queryText.concat(", ");
                }

                i++;
            }
            queryText = queryText.concat("WHERE id = $");
            queryText = queryText.concat(i);
            queryValues.push(user_id);

            console.log(queryText);
            console.log(queryValues);

            const res = await client.query(queryText, queryValues);
            
        } catch (e) {
            console.log("Error in setUserData: " + e);
        }
    }

}
export default new User();