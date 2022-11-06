export default class UserDbError extends Error {
    constructor(message, errors = []) {
        super(message);
        this.errors = errors;
    }

    static AddUserErrorsHandle(message, data) {
        
        // console.log("ahyet", message.constraint);
        
        if (message.constraint === "users_login_key") {
            return new UserDbError("User with such login already exists", {login: data.login});
        } else if (message.constraint === "users_email_key") {
            return new UserDbError("User with such email already exists", {email: data.email});
        } else {
            return new UserDbError("Unkown DB error", message);
        }
        
    }

    static UserNotFoundHandle(data) {
        return new UserDbError("User with such login not found!", { login: data });
    }

}