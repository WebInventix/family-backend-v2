const express = require("express");
const UserController =require("../../controllers/user_controller/index")
const Parenting =require("../../controllers/user_controller/parenting")

const router = express.Router();


router.post('/update-parent', UserController.update_parent)
router.post('/invtie-co-parent',UserController.add_co_parent)
router.get('/get-family', UserController.getFamily)
router.post('/add-children',UserController.addChildren)
// calendat api
router.post('/create-event',  UserController.create_calendar_event);
router.get('/get-create-event/:family_id',  UserController.get_calendar_event);
router.get('/get-create-event-by-id/:event_id',  UserController.get_calendar_event_by_id);
router.delete('/delete-event/:event_id',  UserController.delete_calendar_event);
router.put('/edit-event',  UserController.edit_calendar_event);

//Parenting
router.post('/create-parenting', Parenting.addParenting)
router.get('/get-parenting-family/:family_id', Parenting.getParenting)
router.get('/get-parenting-id/:id', Parenting.getParentingById)
router.delete('/delete-parenting/:parent_id',  Parenting.deleteParenting);
router.put('/edit-parenting',  Parenting.editParenting);

module.exports = router;
