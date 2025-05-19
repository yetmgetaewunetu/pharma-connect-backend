const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/emailService')
const crypto = require('crypto')
const CustomError = require('../utils/customError')
const Inventory = require('../models/inventoryModel')
const mongoose = require("mongoose");
 

//signup

exports.signUp = async(userData) => {
    if (userData.password !== userData.confirmPassword){
        throw new CustomError("Confirimation password doesn't match",400);
    }

    const existingUser =await User.findOne({email: userData.email })
     
    if (existingUser){
        throw new CustomError("Email or Username already exist.",400);
    }

    const user = new User(userData); 
    await user.save();
    return user;
}

// sign in

exports.signIn = async (userData) => {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email }); 

    if (!existingUser) {
        throw new CustomError("Email does not exist.",400);
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        throw new CustomError("Incorrect password.",401);
    }

    const token = jwt.sign(
        {
            id: existingUser._id,
            email: existingUser.email, 
            role: existingUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_SECRET_EXPIRES }
    );

    const role = existingUser.role
    const pharmacyId = existingUser.pharmacyId
    const userId = existingUser._id

    return {token, role, pharmacyId,userId};
};


// update password

exports.updatePssword = async (passwords, userData) => {
    const { oldPassword, newPassword, comfirmNewPassword } = passwords;
    
    // check if newpassword  matchs confirmation password
    if (newPassword !== comfirmNewPassword) {
        throw new CustomError("The new password confirmation failed. Please try again",400);
    }

    // check if the older password match
    const existingUser = await User.findById(userData.userid);

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
        throw new CustomError("Passwords do not match.",401);
    }

     // update the password
     existingUser.password = newPassword;
     // Save the updated password
    await existingUser.save();
};


// forget password

exports.forgetPassword = async (email, protocol, host) => {
    try {
        // 1. Get the user based on the posted email
        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomError(`The email ${email} doesn't exist`,400);
        }

        // 2. Generate a random reset token
        const resetToken = user.passwordResetTokenGenerator();
        await user.save({ validateBeforeSave: false });

        // 3. Create reset URL
        const resetURL = `${protocol}://${host}/api/v1/users/resetPassword/${resetToken}`;

        // 4. Create the email message
        const message = `Click the link to reset your password: ${resetURL}`;

        // 5. Send email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
        });

        return { success: true, message: 'Token sent to email' };
    } catch (error) {
        // Cleanup if email fails
        if (error.message.includes('send email')) {
            const user = await User.findOne({ email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
        }
        throw error;
    }
};


//recet passowrd

exports.resetPassword = async (resetToken, newPassword) => {
    try {
        // Hash the token provided
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user with matching token and ensure token hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new CustomError("Token doesn't exist or has expired!",401);
        }

        // Reset password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        // Generate JWT token
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPIRES }
        );

        return { user, jwtToken };
    } catch (error) {
        throw error;
    }
};


// delete  Account

 
exports.deleteAccount = async (userData) => {
   
    const user = await User.findById(userData.userid);
    
    if (!user) {
        throw new CustomError('User not found!',400);
    }

    await User.findByIdAndDelete(userData.userid);
    return
};

exports.getMyMedicines = async (userData) => {
    const user = await User.findById(userData.userid);

    if (!user) {
        throw new CustomError('User not found!', 400);
    }

    // Fetch inventory items, then format the cart data
    const inventoryItems = await Inventory.find({ '_id': { $in: user.cart } }) // Find only the items in the user's cart
    .populate("pharmacy")
    .populate("medicine");
    
    // Format the cart items
    const formatedCart = await Promise.all(inventoryItems.map(async (item) => {

        return {
            pharmacyName: item.pharmacy.name,
            inventoryId: item._id.toString(),
            address: item.pharmacy.address,
            photo: item.medicine.image,
            price: item.price,
            quantity: item.quantity,
            latitude: item.pharmacy.latitude,
            longitude: item.pharmacy.longitude,
            pharmacyId: item.pharmacy._id,
            medicineId: item.medicine._id,
            medicineName: item.medicine.name,
        };
    }));

    return formatedCart;
};



// add to my medicine   

exports.addToCart = async (userData, inventoryIdObject) => {
    // Extract the inventoryId from the object
    const inventoryId = inventoryIdObject.inventoryId;
  
    // Validate that the inventoryId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
      throw new CustomError('Invalid inventory ID!', 400);
    }
  
    const inventory = await Inventory.findById(inventoryId);
  
    if (!inventory) {
      throw new CustomError('Inventory item not found!', 400);
    }
  
    const user = await User.findById(userData.userid);
  
    if (!user) {
      throw new CustomError('User not found!', 400);
    }
  
    // Check if the inventory item is already in the cart
    if (!user.cart.includes(inventoryId)) {
      user.cart.push(inventoryId);
      await user.save();
    }
  
    return user;
  };





// Delete a single medicine
exports.deleteSingleMyMedicines = async (userData, pharmacyId, medicineId) => {
    const user = await User.findById(userData.userid);
    
    if (!user) {
      throw new CustomError('User not found!', 400);
    }
  
    const cart = user.cart; // Assuming `user.cart` is an array of inventory IDs.
  
    // Iterate and check each item in the cart
    for (let i = 0; i < cart.length; i++) {
      const inventory = await Inventory.findById(cart[i]);
  
      if (inventory && inventory.pharmacy.toString() === pharmacyId && inventory.medicine.toString() === medicineId) {
        cart.splice(i, 1); // Remove the matched inventory
        break; // Stop after deleting the first matching item
      }
    }
  
    user.cart = cart; // Update the user's cart
    await user.save();
  
    return user;
  };
  
  // Delete all medicines
  exports.deleteAllMyMedicines = async (userData) => {
    const user = await User.findById(userData.userid);
  
    if (!user) {
      throw new CustomError('User not found!', 400);
    }
  
    user.cart = []; // Clear the cart
    await user.save();
  
    return user;
  };
  