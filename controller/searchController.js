const asyncErrorHandler = require("../utils/asyncErrorHandler");
const customError = require('../utils/customError');
const searchServices = require('../services/searchServices');


exports.searchMedicineController = asyncErrorHandler(async(req, res) => {
    const { medicineName } = req.body;

    if (!medicineName) {
        throw new customError('Please provide a medicine name to search.', 400);
      }

    const results = await searchServices.searchMedicine({ medicineName });

    res.status(200).json({
        success: true,
        count: results.length,
        data: results,
    })
})