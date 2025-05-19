const CustomError = require('../utils/customError');

// Handle Development Errors
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error: error,
    });
};

// Specific Error Handlers
const castErrorHandler = (error) => {
    const message = `Invalid value for ${error.path}: ${error.value}`;
    return new CustomError(message, 400);
};

const duplicateKeyErrorHandler = (error) => {
    const field = Object.keys(error.keyValue)[0]; // Get the duplicate field
    const value = Object.values(error.keyValue)[0]; // Get the duplicate value
    const message = `Duplicate value for field '${field}': '${value}'. Please use a different value.`;
    return new CustomError(message, 400);
};

const validationErrorHandler = (error) => {
    const messages = Object.values(error.errors).map((val) => val.message).join(', ');
    return new CustomError(messages, 400);
};

//Jwt expired error
const expiredJWTHandler= (error) =>{
    return new customError( "JWT has expired. please login again", 401)
} 

// invalid token/seginture
const JWTErrorHandler= (error) =>{
    return new customError( "Invalid token.", 401)
}  

// Handle Production Errors
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.error('Unexpected Error 💥:', error); // Log unexpected errors
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.',
        });
    }
};

// Global Error Middleware
module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        console.log('Error:', error);
        devErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        console.log('Error:', error);

        // Specific Error Handlers
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error); // Duplicate key
        if (error.name === 'ValidationError') error = validationErrorHandler(error);

        prodErrors(res, error);
    }
};






// const customError = require('../utils/customError')
// // Dev Errors
// const devErrors = (res, error) => {
//     res.status(error.statusCode).json({
//         status: error.statusCode,
//         message: error.message,
//         stackTrace: error.stack,
//         error: error
//     });
// }

// const castErrorHandler = (error) => {
//     const message = `Invalid value  for ${error.path} : ${error.value}`
//     new customError(message, 400)
// }

// const duplicatekeyErrorHandler = (error) => {
//     const message = `Item with this id already exist.`
//     new customError(message, 400)
// }

// const validationErrorHandler = (error) => {
//     const messages = Object.values(error.errors).map((val) => val.message).join(', ');
//     return new CustomError(messages, 400);
// };

// // Production Errors
// const ProdError = (res, error) =>{
//     if(error.isOperational){
//         res.status(error.statusCode).json({
//             status: error.statusCode,
//             message: error.message,
//         });
//     }else {
//         res.status(500).json({
//             status: 'error',
//             message: 'Something went wrong! Please try again later.',
//         });
//     }
// }



// module.exports = (error, req, res, next) => {
//     error.statusCode = error.statusCode || 500;
//     error.status = error.status || 'error'
    
//     if(process.env.NODE_ENV === 'development'){
//         console.log(error)
//         devErrors(res,error)
//     } else if (process.env.NODE_ENV === 'production'){
        
//         if(error.name === 'CastError') error = castErrorHandler(error);
//         if(error.code === 11000) error = duplicatekeyErrorHandler(error);
//         if (error.name === 'ValidationError') error = validationErrorHandler(error);


//         ProdError(res,error)
//     }
// }