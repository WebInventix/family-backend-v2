const express = require("express");
const UserController =require("../../controllers/user_controller/index")
const Parenting =require("../../controllers/user_controller/parenting")
const Expenses = require("../../controllers/user_controller/expenses")
const Resource = require("../../controllers/user_controller/posts")
const router = express.Router();


router.post('/update-parent', UserController.update_parent)
router.post('/invtie-co-parent',UserController.add_co_parent)
router.get('/get-family', UserController.getFamily)
router.post('/add-children',UserController.addChildren)
router.post('/edit-children', UserController.editChildren)
router.get('/get-children-by-id/:child_id',  UserController.getChildrenById);
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

//Expenses
router.post('/add-expense',  Expenses.addExpense);
router.get('/get-expense/:family_id',  Expenses.getExpense);
router.get('/get-single-expense/:expense_id',  Expenses.getExpenseById);
router.delete('/delete-expense/:expense_id',  Expenses.deleteExpense);
router.put('/edit-expense',  Expenses.editExpense);

//Balance
router.post('/add-balance',  Expenses.addBalance);
router.get('/get-balance/:family_id',  Expenses.getBalance);
router.get('/get-single-balance/:balance_id',  Expenses.getBalanceById);
router.delete('/delete-balance/:balance_id',  Expenses.deleteBalance);
router.put('/edit-balance',  Expenses.editBalance);


//Posts
router.post('/add-post',  Resource.addPost);
router.post('/like-post',  Resource.postLikes);
router.get('/get-all-post', Resource.getAllPostsWithLikes)
router.post('/add-comment', Resource.addComment)
router.get('/get-single-post/:id', Resource.getSinglePost)

//Dashboard
router.get('/get-dashboard', UserController.family_dashboard)
module.exports = router;
