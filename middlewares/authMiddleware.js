const jwt = require('jsonwebtoken');
const User = require('../models/UserModel')
const customError = require('../utils/customError')

exports.authMiddleware = async ( req, res, next ) => {
    // 1. Check if authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new customError("You are not logged in.",401));
    }

    const token = authHeader.split(' ')[1];
    console.log("🚀 ~ file: authMiddleware.js:14 ~ exports.authMiddleware= ~ token:", token)

    if (!token) {
        return next(new customError("You are not logged in.",401));
    }

    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    const user =await User.findOne({username : decodedToken.username})
    
    if(!user){
        next(new customError("The user with the given token does not exist", 401))
    }

    req.user = {
        userid: decodedToken.id,
        email:decodedToken.email,
        role: decodedToken.role,
    }

    next()

}  

// authenticate admins 
exports.restrict =(role)=>{ ///(...roles)
    return (req,res,next)=>{
        if (!req.user.role === role){
            next(new Error("Only admins are authorized."))
        }
        next()
}}