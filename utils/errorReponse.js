const errorHandler = require("../middleware/error");

class ErrorReponse extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    } 
}
module.exports = ErrorReponse;