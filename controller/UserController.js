const UserServices = require("../services/UserServices");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// Sign up Controller

exports.signUpController = asyncErrorHandler(async (req, res) => {
  const newUser = await UserServices.signUp(req.body);
  res.status(201).json({
    success: true,
    message: "User created successfully!",
    data: {
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    },
  });
});

// // Sign In Controller

exports.signInController = asyncErrorHandler(async (req, res) => {
  const response = await UserServices.signIn(req.body);
  res.set("Authorization", `Bearer ${response.token}`);
  res.status(200).json({
    success: true,
    message: "User logged-in successfully!",
    data: {
      role: response.role,
      pharmacyId: response.pharmacyId,
      userId: response.userId,
    },
  });
});

// exports.signInController = asyncErrorHandler(async (req, res) => {
//     const response = await UserServices.signIn(req.body);
//     res.cookie("authToken", response.token, {
//         httpOnly: true,       // Prevent JavaScript access
//         secure: false,        // Set to true if using HTTPS
//         sameSite: "None",     // Required for cross-origin cookies
//     });
//     // Set the token in a cookie
//     res.cookie("authToken", response.token, {
//         httpOnly: true, // Prevent JavaScript from accessing the cookie
//     }).status(200).json({
//         success: true,
//         role: response.role,
//         pharmacyId: response.pharmacyId,
//         userId: response.userId,
//     });
// });

// forgot password controller

exports.forgetPassword = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;
  const result = await UserServices.forgetPassword(
    email,
    req.protocol,
    req.get("host")
  );
  res.status(200).json({
    status: true,
    message: result.message,
  });
});

// reset passswprd Controller.js

exports.resetPassword = asyncErrorHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const { jwtToken } = await UserServices.resetPassword(resetToken, password);
  res.status(200).json({
    status: true,
    token: jwtToken,
  });
});

// password update controller

exports.changePasswordController = asyncErrorHandler(async (req, res) => {
  await UserServices.updatePssword(req.body, req.user);
  res.status(200).json({
    success: true,
    message: "Password updated successfully!",
  });
});

// delete controller

exports.deleteAcountController = asyncErrorHandler(async (req, res) => {
  await UserServices.deleteAccount(req.user);
  res.status(200).json({
    success: true,
    message: "Account deleted successfully!",
  });
});

// add to cart controller

exports.addtoCartController = asyncErrorHandler(async (req, res) => {
  const inventoryId = req.body;
  console.log(
    "🚀 ~ file: UserController.js:123 ~ exports.addtoCartController=asyncErrorHandler ~ invenotryId:",
    inventoryId
  );
  await UserServices.addToCart(req.user, inventoryId);
  res.status(201).json({
    success: true,
    message: "Medicine added to My Medicines successfully!",
  });
});

// get my medicnes controller

exports.getMyMedicinesController = asyncErrorHandler(async (req, res) => {
  const myMedicines = await UserServices.getMyMedicines(req.user);
  res.status(201).json({
    success: true,
    data: myMedicines,
  });
});

// delete a single my medicnes controller
exports.deleteSinlgeMyMedicinesController = asyncErrorHandler(
  async (req, res) => {
    const { pharmacyId, medicineId } = req.body;
    const myMedicines = await UserServices.deleteSingleMyMedicines(
      req.user,
      pharmacyId,
      medicineId
    );
    res.status(204).json({
      success: true,
      data: myMedicines,
    });
  }
);

// delete a all my medicnes controller
exports.deleteAllMyMedicinesController = asyncErrorHandler(async (req, res) => {
  const myMedicines = await UserServices.deleteAllMyMedicines(req.user);
  res.status(204).json({
    success: true,
    data: myMedicines,
  });
});
