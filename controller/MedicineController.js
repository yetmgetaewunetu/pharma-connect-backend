const MedicineServices = require("../services/MedicineServices");
const asyncErrorHandler = require('../utils/asyncErrorHandler');

// Add medicine controller
exports.addMedicineController = asyncErrorHandler(async (req, res) => {
    const newMedicine = await MedicineServices.addMedcine(req.body);
    res.status(201).json({
        success: true,
        message: "Medicine created successfully!",
        data: {
            medicine: {
                name: newMedicine.name,
                category: newMedicine.category,
            },
        },
    });
});

// Edit medicine details controller
exports.editMedicineDetailController = asyncErrorHandler(async (req, res) => {
    const { medicineId } = req.params;  
    const updatedData = req.body;  

    const updatedMedicine = await MedicineServices.editMedicine(medicineId, updatedData);
    res.status(200).json({
        success: true,
        message: "Medicine details updated successfully",
        data: updatedMedicine,
    });
});

// Delete medicine controller
exports.deleteMedicineController = asyncErrorHandler(async (req, res) => {
    const { medicineId } = req.params;
    const deletedMedicine = await MedicineServices.deleteMedicine(medicineId);
    res.status(200).json({
        success: true,
        message: "Medicine deleted successfully",
        data: deletedMedicine,
    });
});

// List medicines controller
exports.listMedicinesController = asyncErrorHandler(async (req, res) => {
    const listOfMedicines = await MedicineServices.listMedicine();
    res.status(200).json({
        success: true,
        data: listOfMedicines,
    });
});

// Get medicine controller
exports.getMedicineController = asyncErrorHandler(async (req, res) => {
    const { medicineId } = req.params; // Use params for IDs
    const medicine = await MedicineServices.getMedicineById(medicineId);
    res.status(200).json({
        success: true,
        data: medicine,
    });
});
