const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Childrens } = require("../../models/ChildModel");
const { Family } = require("../../models/family");
const { Calendar_Schema } = require("../../models/calender_model");
const {Parenting} = require("../../models/Parenting");
const { Expenses  } = require("../../models/Expenses");


const addExpense = async (req,res) => {
    console.log('yes')
    const {body ,user_id } = req;
    const {amount,date,reason,child_id,notes,attachment,family_id} = body;
  
    if(!amount || !child_id || !date)
      {
        return res.status(300).json({messsage:"Amount, Date & Children are required fields"})
      }
  
      try {
        const expense = {amount,date,reason,child_id,notes,attachment,user_id:user_id,family_id};
        const expense_data = await Expenses.create({
          ...expense,
        });
    
        return res.json({
          message: "Create successfully!",
          data: expense_data,
        });
      } catch (error) {
        return res.status(300).json({message:error.message})
      }
  }

  const getExpense = async (req,res) => {
    const { user_id } = req;
    const { family_id } = req.params
  
    try {
      const job_post_variable = await Expenses.find({
        family_id
      });
  
      return res.json({
        message: "List all expenses successfully!",
        data: job_post_variable,
      });
    } catch (error) {
      return res.status(300).json({ message: error.message });
    }
  }



  const getExpenseById = async (req,res) =>{
    const { expense_id } = req.params;
  
    try {
      const expenses = await Expenses.findById(expense_id).populate('child_id').populate('user_id').populate('family_id');
      return res.json({
        message: "Get Expense by id successfully!",
        data: expenses,
      })
    } catch (error) {
      return res.status(300).json({ message: error.message });
      
    }
  }


  const editExpense = async (req,res) => {
    const { expense_id } = req.body;
  
    const updateData = { ...req.body };
    delete updateData.expense_id;
  
    try {
      const updatedEvent = await Expenses.findByIdAndUpdate(
        expense_id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      return res.json({
        message: "Updated successfully!",
        data: updatedEvent,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  const deleteExpense = async (req,res) => {
    const { expense_id } = req.params;
    try {
      const deletedEvent = await Expenses.findByIdAndDelete(expense_id);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      return res.json({
        message: "Deleted successfully!",
        data: deletedEvent,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
module.exports = {
    addExpense,
    getExpense,
    editExpense,
    deleteExpense,
    getExpenseById

};
