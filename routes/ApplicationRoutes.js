const express = require("express");
const router = express.Router();
const ApplicationController = require("../controller/ApplicationController");

// pharmacy application (by owner)
router.post("/createApplication", ApplicationController.createApplicationController);

// get application (see application detail, ) (by system admin, owner)
router.get("/:applicationId", ApplicationController.getApplicationController);

// update application  (owner)
router.patch("/:applicationId/update", ApplicationController.updateApplicationController);


// application status update (approve, reject , pending, on progress)  (admin)
router.patch('/:applicationId/status', ApplicationController.updateApplicationStatusController);

// delete application  (owner)
router.delete("/:applicationId/delete", ApplicationController.deleteApplicationController);

// get all applications (admin)       ??? filters???
router.get("/", ApplicationController.getApplicationsController);

module.exports = router;
