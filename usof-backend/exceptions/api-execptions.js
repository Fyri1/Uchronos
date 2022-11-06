export default class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static NotFound(message, errors) {
        return new ApiError(404, message, errors);
    }


    static InvalidData( message, errors) {
        return new ApiError(422, message, errors);
    }

}