const express = require("express");
//controller call 
const UserController = require('../../controllers/user_controller_v3/index')
const router = express.Router();

//Member View
router.get('/view-member/:id', UserController.viewMember)

//Add Children
router.post('/add-child', UserController.addChild);
router.post('/update-child/:child_id', UserController.updateChild);
router.get('/child-list', UserController.listChildren);

//Add Relative
router.post('/add-relative', UserController.addRelative);
router.post('/update-relative/:relative_id', UserController.updateRelative);
router.get('/relative-list', UserController.listRelative);
module.exports = router;
