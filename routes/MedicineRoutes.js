const express = require('express');
const router = express.Router();
const MedicineController=require("../controller/MedicineController") 



// medicine routes

//add medicine route
router.post('/',MedicineController.addMedicineController);

//edit medicine route
router.patch('/:medicineId',MedicineController.editMedicineDetailController);

//delete medicine route
router.delete("/:medicineId",MedicineController.deleteMedicineController);

//list medicine route
router.get('/', MedicineController.listMedicinesController);

//get medicine route
router.get('/:medicineId', MedicineController.getMedicineController);


module.exports = router