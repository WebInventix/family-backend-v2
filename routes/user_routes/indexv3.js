const express = require("express");
//controller call 
const UserController = require('../../controllers/user_controller_v3/index')
const Family  = require('../../controllers/user_controller_v3/family')
const {addEvents, eventById,listEvents, updateEvent, deleteEvent} = require('../../controllers/user_controller_v3/events')
const router = express.Router();

//Member View
router.get('/view-member/:id', UserController.viewMember)

//Get Members
router.get('/get-members', UserController.getMembers)

//Add Children
router.post('/add-child', UserController.addChild);
router.post('/update-child/:child_id', UserController.updateChild);
router.get('/child-list', UserController.listChildren);

//Add Relative
router.post('/add-relative', UserController.addRelative);
router.post('/update-relative/:relative_id', UserController.updateRelative);
router.get('/relative-list', UserController.listRelative);


//Add Co-Parent
router.post('/add-coparent-member', UserController.addCoparent)
router.get('/list-co-parent', UserController.listCp)


//Family
router.post('/add-family', Family.addFamily)
router.get('/family-list', Family.listFamilies)
router.get('/get-family', Family.getFamily)
router.get('/family/:id', Family.getById)
router.post('/update-family/:id', Family.updateFamily)
router.delete('/delete-family/:id', Family.deleteFamily)
//Events
router.post('/add-event', addEvents)
router.get('/list-events/:family_id', listEvents)
router.get('/event/:id', eventById)
router.post('/update-event/:id', updateEvent)
router.delete('/delete-event/:id', deleteEvent)

//Dashboard
router.get('/get-dashboard', UserController.getDashboard)



module.exports = router;
