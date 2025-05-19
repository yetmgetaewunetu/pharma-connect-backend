const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')
const {authMiddleware}  = require('../middlewares/authMiddleware');


// sign up route
router.post('/signUp',UserController.signUpController);

// sign in route
router.post('/signIn',UserController.signInController);

// forget password
router.post('/forgetPassword',authMiddleware,UserController.forgetPassword);

// reset password
router.patch('/resetPassword/:resetToken',authMiddleware,UserController.resetPassword);

// update/change password
router.patch('/changePassword',authMiddleware,UserController.changePasswordController);

//delete me  
router.delete('/deleteMe',authMiddleware,UserController.deleteAcountController);

//add to cart  
router.post('/addtocart',authMiddleware,UserController.addtoCartController);


//get cart
router.get('/my-medicines',authMiddleware,UserController.getMyMedicinesController);


//delete single my medicine
router.delete('/my-medicines/',authMiddleware,UserController.deleteSinlgeMyMedicinesController);

//delete all my medicine
router.delete('/my-medicines/deleteAll',authMiddleware,UserController.deleteAllMyMedicinesController);


module.exports = router