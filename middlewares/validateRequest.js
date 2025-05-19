const customError = require("../utils/customError")

const validate =(schema) => {
    return (req,res,next) =>{
        const {error} = schema.validate(req.body, {abortEarly:false});

        if (error) {
            const errorMessages = error.details.map((err) => err.message).join(", ");             
            return next(new customError(errorMessages, 400));
        }
        next()
    }
} 

module.exports = validate