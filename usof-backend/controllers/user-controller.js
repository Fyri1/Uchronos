import { v4 as uuidv4 } from 'uuid';

import User from "../models/User.js";
import client from '../db.js';
import encrypt from '../service/cryptopass.js';
import TokenSer from '../service/tokenServ.js';

class UserControll {
    async getAllUsers(req, res, next)
    {
        try{
        const data = await User.getlistUsers();
        res.status(200);
        res.json({ message: "All user list", user_list: data });
        }catch (e) {
        console.log("Error in getAllUsers " + e);

        next(e);
        }
        
    }
    async createNewUser (req, res, next) {
        try {
            // ADD VALIDATION FOR PASSWORD
            const { login, password, password_confirmation, full_name, email, role } = req.body;

            const encryptedPassword = encrypt(password);
            console.log(encryptedPassword);

            const id = uuidv4();

            const token = TokenSer.generToken(
                { 
                    id: id, 
                    login: login, 
                    password: encryptedPassword, 
                    email: email });
            await User.addUser(id, login, encryptedPassword, full_name, email, role, token);

            res.status(200);
            res.json({ message: "User created: ", user_data: {
                login: login,
                password: password,
                password_confirmation: password_confirmation,
                full_name: full_name,
                email: email,
                role: role 
            }});

        } catch (e) {
            console.log("Error in createNewUser " + e);

            next(e);
        }
    }

    async getDataUser (req, res, next) {
        try {
            const { user_id } = req.params;
            // console.log(  user_id);
            const data = await User.getUserData("id",  user_id );
            // console.log( "Ebabnaya data" + data);
            res.status(200);
            res.json({ message: "user data: ", user_data: data });

        } catch (e) {
            console.log(" Error in getDataUser " + e);

            next(e);
        }
    }

    async UserAvatar (req, res, next) {
        try {
            res.status(400);
            res.json({ message: "dodelat !" });

        } catch (e) {
            console.log("erroe UserAvatar " + e);

            next(e);
        }
    }
    async updateUser (req, res, next) {
        try {
            const { user_id } = req.params;
            await User.setUserData(req.body, user_id);
            res.status(200);
            res.json({ message: "User data updated" });

        } catch (e) {
            console.log("Error in updateUser " + e);
            next(e);
        }
    }
    async deleteUserOnId (req, res, next) {
        try {
            const { id } = req.params;

            const queryText = "DELETE FROM users WHERE id = $1";
            const queryValues = [id];
            await client.query(queryText, queryValues);

            res.status(200);
            res.json({ message: "User deleted!" });

        } catch (e) {
            console.log("Error in deleteUserOnId " + e);

            next(e);
        }
    }
}
export default new UserControll();