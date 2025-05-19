const Pharmacy = require("../models/pharmacyModel");
const Inventory = require("../models/inventoryModel")
const Medicine = require("../models/MedicineModel")
const CustomError = require("../utils/customError");
const User = require("../models/UserModel");


// Get pharmacy by ID
exports.getPharmacyById = async (id) => {
  const pharmacy = await Pharmacy.findById(id);
  
  if (!pharmacy) {
    throw new CustomError('Pharmacy not found', 404);
  }

  return pharmacy;
};

// Update a pharmacy's information
exports.updatePharmacy = async (id, updateData) => {
  const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updateData, {
    new: true,  
  });

  if (!updatedPharmacy) {
    throw new CustomError('Pharmacy not found', 404);
  }

  return updatedPharmacy;
};

// Delete a pharmacy
exports.deletePharmacy = async (id) => {
  const deletedPharmacy = await Pharmacy.findByIdAndDelete(id);

  if (!deletedPharmacy) {
    throw new CustomError('Pharmacy not found', 404);
  }

  return deletedPharmacy;
};

// Get all pharmacies with optional filtering
exports.getPharmacies = async () => {
  const pharmacies = await Pharmacy.find();
  return pharmacies;
};

// Get all pharmacies  
exports.getPharmacists = async (pharmacyId) => {
  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new CustomError("Pharmacy doesn't exist.", 404);
  }

  const pharmacists = await User.find({pharmacyId: pharmacyId})
  return pharmacists;
};


exports.removePharmacist = async (pharmacyId, pharmacistId) => {
 
  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new CustomError("Pharmacy doesn't exist.", 404);
  }

  const pharmacist = await User.findOneAndUpdate(
    { _id: pharmacistId, pharmacyId },  
    { role: "user", pharmacyId: null }, 
    { new: true } 
  );

  if (!pharmacist) {
    throw new CustomError("Pharmacist not found or not associated with this pharmacy.", 404);
  }

  return pharmacist;
};



/***inventory */
 
// get inventory of a pharmacy 
exports.getInventory = async (pharmacyId) => {
  const pharmacy = await Pharmacy.findById(pharmacyId);

  if (!pharmacy) {
    throw new CustomError("Pharmacy doesn't exist.", 404);
  }

  const inventory = await Inventory.find({ pharmacy: pharmacyId });

  if (!inventory || inventory.length === 0) {
    throw new CustomError("This pharmacy doesn't have inventory.", 404);
  }

  const inventoryData = await Promise.all(
    inventory.map(async (item) => {
      const medicine = await Medicine.findById(item.medicine);
      return {
        ...item._doc, // Include all existing item fields
        medicineName: medicine ? medicine.name : "Unknown",
        category: medicine ? medicine.category : "Unknown",
      };
    })
  );

  return inventoryData;
};


// add medicine to inventory  
exports.addInventoryItem =  async (pharmacyId,medicineData) => {
  const inventoryData= {... medicineData,medicine:medicineData.medicineId, pharmacy:pharmacyId};

  const pharmacy = await Pharmacy.findById(pharmacyId);

  if (!pharmacy) {
    throw new CustomError(`A pharmacy with id: ${pharmacyId} doesn't exist.`, 404);
  }
  
  const medicine = await Inventory.findOne({medicine: medicineData.medicineId, pharmacy:pharmacyId});

  if (medicine) {
    throw new CustomError(`medicine already exist in the inventory.`, 404);
  }

  const medicines = await Medicine.findById(medicineData.medicineId);

  if (!medicines) {
    throw new CustomError(`A medicine with id: ${medicineData.medicine} doesn't exist.`, 404);
  }

  const addedMedicine = new Inventory(inventoryData)
  await addedMedicine.save()

  return addedMedicine;
};
 

// Get single medicine in inventory
exports.getInventoryItem = async (pharmacyId, inventoryId) => {
  const pharmacy = await Pharmacy.findById(pharmacyId);

  if (!pharmacy) {
    throw new CustomError(`A pharmacy with id: ${pharmacyId} doesn't exist.`, 404);
  }
  
  const inventory = await Inventory.findById(inventoryId);

  if (!inventory) {
    throw new CustomError(`An inventory with id: ${inventoryId} doesn't exist.`, 404);
  }

  const medicine = await Medicine.findById(inventory.medicine);

  return {
    ...inventory.toObject(), // Convert mongoose object to plain JavaScript object if needed
    medicineName: medicine.name // Adding medicine name as a property
  };
};


// update quantity,price & expiredate
exports.updateInventoryItem = async (pharmacyId, inventoryId, medicineData) => {
  const pharmacy = await Pharmacy.findById(pharmacyId);

  if (!pharmacy) {
    throw new CustomError(`A pharmacy with id: ${pharmacyId} doesn't exist.`, 404);
  }
  
  const inventory = await Inventory.findById(inventoryId);

  if (!inventory) {
    throw new CustomError(`A inventory with id: ${inventoryId} doesn't exist.`, 404);
  }

  const medicine = await Inventory.findOne({ pharmacy: pharmacyId, medicine: medicineData.medicineId });

  if (!medicine) {
    throw new CustomError(`Medicine doesn't exist in the inventory.`, 404);
  }

  const updatedMedicine = await Inventory.findOneAndUpdate(
    { pharmacy: pharmacyId, medicine: medicineData.medicineId },
    {
      $set: {
        price: medicineData.price,
        quantity: medicineData.quantity,
        expiryDate: medicineData.expiryDate, 
      },
    },
    { new: true } 
  );

  return updatedMedicine;
};


// Delete medicine from inventory
exports.deleteInventoryItem = async (pharmacyId, inventoryId) => {

  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    throw new CustomError(`Pharmacy with id: ${pharmacyId} doesn't exist.`, 404);
  }

  const medicine = await Inventory.findOne({ pharmacy: pharmacyId, _id: inventoryId });
  if (!medicine) {
    throw new CustomError(`Medicine doesn't exist in the inventory.`, 404);
  }

  const deletedMedicine = await Inventory.deleteOne({ pharmacy: pharmacyId, _id: inventoryId });
   
  return deletedMedicine
};
