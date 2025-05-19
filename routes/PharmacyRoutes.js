const express = require("express");
const router = express.Router();
const pharmacyController = require("../controller/PharmacyController");
// const validateRequest = require('../middlewares/validateRequest')

/**pharmacy routes */

// add pharmacy (after admin approved)
// router.post("/",validateRequest(pharmacyValidationSchema),pharmacyController.addPharmacyController);

// get pharmacy detail/profile  (everybody)
router.get("/:id", pharmacyController.getPharmacyController);

// update pharmacy profile (pharmacist)
router.patch("/:id", pharmacyController.updatePharmacyController);

// delete pharmacy (pharmacist & system admins)
router.delete("/:id", pharmacyController.deletePharmacyController);

// get all pharmacies ( )
router.get("/", pharmacyController.getPharmaciesController);

// get  pharmacists ( )
router.get("/:id/pharmacists", pharmacyController.getPharmacistsController);

// remove  pharmacists ( )
router.patch("/:id/pharmacists/:pharmacistId", pharmacyController.removePharmacistController);


/**manage inventory routes */

// add medicine to inventory (pharmacist)
router.post('/:pharmacyId/inventory', pharmacyController.addInventoryItem);

// get inventory of a pharmacy/list of medicines&quantiies+price (phramacist & pharmacy profile)
router.get('/:pharmacyId/inventory', pharmacyController.getInventory);

// get s single invnentory of pharmacy (single medicine)
router.get('/:pharmacyId/inventory/:inventoryId', pharmacyController.getInventoryItemController);

// update quantity,price & expiredate
router.patch('/:pharmacyId/inventory/:inventoryId', pharmacyController.updateInventoryItem);


// delete medicine from inventory
router.delete('/:pharmacyId/inventory/:inventoryId', pharmacyController.deleteInventoryItem);

// // Submit application
// router.post('/pharmacies', pharmacyController.submitApplication);

module.exports = router;








// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Search for medicinesN
// router.get('/medicines', userController.searchMedicines);

// // View pharmacy details
// router.get('/pharmacies/:pharmacyId', userController.viewPharmacyDetails);

// // Save to cart
// router.post('/users/:userId/cart', userController.addToCart);
// router.get('/users/:userId/cart', userController.getCart);
// router.delete('/users/:userId/cart/:itemId', userController.removeFromCart);

// module.exports = router;


 


 


// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');

// // Approve/Reject Pharmacy Applications
// router.get('/admin/pharmacy-applications', adminController.getPharmacyApplications);
// router.put('/admin/pharmacy-applications/:applicationId', adminController.processPharmacyApplication);

// // Manage Pharmacies
// router.get('/admin/pharmacies', adminController.getPharmacies);
// router.post('/admin/pharmacies', adminController.addPharmacy);
// router.put('/admin/pharmacies/:pharmacyId', adminController.updatePharmacy);
// router.delete('/admin/pharmacies/:pharmacyId', adminController.deletePharmacy);

// module.exports = router;