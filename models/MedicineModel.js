const mongoose=require("mongoose");

const MedicineSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Medicine category is required'],
        trim: true,
    }, 
})
const Medicine = mongoose.model('Medicine', MedicineSchema)

module.exports = Medicine;
