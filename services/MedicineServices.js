const Medicine = require("../models/MedicineModel");


//add medicine
exports.addMedcine=async(medicineData,pharmacistId)=>{
    const {name,description,image,category}=medicineData;

    const existingMedicine = await Medicine.findOne({name: name})
    if(existingMedicine){
        throw new Error ("Medicine already exists")
    }
    const medicine=new Medicine({
        name,
        description,
        image,
        category,
    });

    await medicine.save()
    return medicine;
}

// edit medicince
exports.editMedicine=async (medicineId,updatedData)=>{
    const medicine=await Medicine.findById(medicineId);
    if(!medicine){
        throw new Error("Medicine not found")
    }
   Object.keys(updatedData).forEach((key)=>{
    medicine[key]=updatedData[key]
   }
   )
   await medicine.save();
   return medicine

}


//delete medicine
exports.deleteMedicine= async(medicineId)=>{
    const deletedMedicine=await Medicine.findByIdAndDelete(medicineId);
    if(!deletedMedicine){
        throw new Error("Medicine not found")
    }
return deletedMedicine;
}




// List medicines
exports.listMedicine = async () => {
    const medicines = await Medicine.find(); // Fetch all medicines from the database
    if (medicines.length === 0) {
        throw new Error("No medicines found");
    }
    return medicines;
};


//get medicine
exports .getMedicineById=async(medicineId)=>{
    const medicine=await Medicine.findById(medicineId)
    if(!medicine){
        throw new Error("Medicine not found")
    }
    return medicine;
}
