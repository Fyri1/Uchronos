import { v4 as uuidv4 } from 'uuid';

import User from '../models/User.js';
import client from '../db.js';
import encrypt from '../service/cryptopass.js';
import SendMail from '../service/send-mail.js';
import TokenSer from '../service/tokenServ.js';
import ApiError from '../exceptions/api-execptions.js';

class loginController {
    
    async Register (req, res, next) {
        try 
        {
            const { login, password, full_name, email } = req.body;
            const sendMassege = new SendMail();
            const enpryptPassword = encrypt(password);
            console.log(enpryptPassword);
            const id = uuidv4();

            const token = TokenSer.generToken({
                id: id,
                login:login,
                password: enpryptPassword,
                email:email,
              });

            await User.addUser(id, login, enpryptPassword, full_name, email, "admin", token);
            // sendMassege.send(email, token, 'activate');
            sendMassege.sendEmailConfirm(email, full_name, token);

            res.status(201);
     
            res.json({message: token});
            res.json("message: token")
            // res.json({message: "ACTIVATE EMAIL LINK SENT"})
        } 
        catch (e) {
            
            next(ApiError.InvalidData(e.message, e.errors));

            next(e);
        }
    }
    async EmailActiv (req, res, next) {
        try {
            const { token } = req.params;
            const tokenData = TokenSer.validToken(token);
            console.log(tokenData);

            await User.setUserData('database_email_activ', true, tokenData.id);
            
            res.status(201);
            res.json({ message: "EMAIL SUCCESSFULLY"});
        } catch (e) {
            console.log("ERROR in EmailActiv " + e);
            

            next(e);
        }
    }

    async Login(req, res, next) {
        const { login, password} = req.body;
        let token;
        try {
            
            const enpryptPassword = encrypt(password);
            const data = await User.getUserData('login', login);
            if (!data) {
                return next(ApiError.InvalidData("User not found!", {login: login}));
            }
            if(enpryptPassword !== data['password'])
            {
                res.json({message: "NEWRNY HASH!",});
            }
            else{
                 token = TokenSer.generToken(
                    { 
                        id: data.id, 
                        login: login, 
                        password: data.password,
                        email: data.email 
                    });
            }


            res.status(200);
            res.json({ message: "Login success!", id: data.id, token: token});
        } 
        catch (e) {

            console.log("ERROR in Login " + e);
            next(e);
        }
    }
    async Logout(req, res, next) {
        try{
            const { id } = req.body;
            const query = {
                text:'UPDATE users SET login_user = $1 ',
                values: [false]
              }
            await client.query(query)
            res.json({ message: "Razlogin" });
        }
        catch(e){
            console.log("ERROR in Logout " + e);
            next(e);

        }
    }
    async SendPasswordReset(req, res, next){
        try{
            const { email } = req.body;
            const sendMassege = new SendMail();

            const userData = await User.getUserData('email', email);
            const token = TokenSer.generToken({
                id: userData.id, 
                login:userData.login,
                password: userData.enpryptPassword,
                email:userData.email,
              });

            sendMassege.sendEmailPassChangeConfirm(email, userData.full_name, token);
            res.json({ message: "SendPasswordReset ZaEBIS" });

        }
        catch(e){
            console.log("ERROR in SendPasswordReset " + e);
            next(e);
        }
    }
    async AuthControllerPassResetConfirm (req, res, next) {
        try {
            const { confirm_token } = req.params;
            console.log("PIZDEC1488");
            console.log(confirm_token);

            res.status(200);
            res.send(
                `<div>
                    <form action="http://localhost:8080/api/auth/password-reset/${confirm_token}" method="POST">
                    <label">Type a new password to reset the old one</label>
                    <input type="password" name="reset_password" id="reset_password">
                    <input type="password" name="reset_confirm_password" id="reset_confirm_password">
                    <input type="submit" value="Change pass">
                    </form>
                </div>`
            );
            
        } catch (e) {
            console.log("ERROR in AuthControllerPassResetConfirm " + e);
            console.log(e);
            next(e);
        }
    }

    async AuthControllerPassResetApply (req, res, next) {
        try {
            const { confirm_token } = req.params;
            const tokenData = tokenService.tokenVerify(confirm_token);
            // ADD VALIDATIONS
            const { reset_password, reset_confirm_password } = req.body;
            const encryptedPassword = await encryptService.hashPass(reset_password);
            
            await User.setUserData('password', encryptedPassword, tokenData.id);
            
            res.status(200);
            res.json({ message: "PASS CHANGED SUCCESSFULLY!"});

        } catch (e) {
            console.log("ERROR in AuthControllerPassResetApply " + e);
            console.log(e);

            next(e);
        }
    }

}

export default new loginController();