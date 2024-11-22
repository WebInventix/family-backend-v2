


const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Childrens } = require("../../models/ChildModel");
const { Family } = require("../../models/family");
const { Calendar_Schema } = require("../../models/calender_model");
const {Parenting} = require("../../models/Parenting");

const { sendWelcomeEmailCoParent } = require("../../utils/email");
const { generateRandomPassword } = require("../../utils/passwordGenerator");

const addParenting = async (req,res) => {
    const {
      user_id,
      startDate,
      endDate,
      isMeeting,
      place,
      notes,
      attachment,
      guardian,
      child_id,
      family_id
    } = req.body;
  
    try {

      // let ucolor = generateRandomLightHexColorWithOpacity();
      var check_family = await Family.findById(family_id)

      const events = {
        user_id,
        startDate,
        endDate,
        isMeeting,
        place,
        notes,
        attachment,
        guardian,
        child_id,
        family_id,
        color: check_family.color_code
      };
      const events_data = await Parenting.create({
        ...events,
      });
  
      return res.json({
        message: "Create successfully!",
        data: events_data,
      });
    } catch (error) {
      return res.status(300).json({ message: error.message });
    }
  
  }



  const getParenting = async (req,res) => {
    const { family_id } = req.params;
 
    var  job_post_variable;
    try{
        var family = await Family.findById(family_id)

         job_post_variable = await Parenting.find({
          $or: [
            { user_id: family.parent_1 },
            { user_id: family.parent_2 }
          ]
        }).populate('user_id').populate('guardian').populate('child_id').populate('family_id');
    
      
        
      return res.json({
        message: "List all Parenting successfully!",
        data: job_post_variable,
      });
    } catch (error) {
      return res.status(300).json({ message: error.message });
    }
  }


  const getParentingById = async (req,res) =>{
    const { id } = req.params;
  
    try {
      const parenting = await Parenting.find({_id:id});
      return res.json({
        message: "Get Parenting by id successfully!",
        data: parenting,
      })
    } catch (error) {
      return res.status(300).json({ message: error.message });
      
    }
  }


  const deleteParenting = async (req, res) => {
    const { parent_id } = req.params;
  
    try {
      const deletedEvent = await Parenting.findByIdAndDelete(parent_id);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      return res.json({
        message: "Deleted successfully!",
        data: deletedEvent,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  const editParenting = async (req,res) => {
    const { parenting_id } = req.body;
  
    const updateData = { ...req.body };
    delete updateData.parenting_id;
  
    try {
      const updatedEvent = await Parenting.findByIdAndUpdate(
        parenting_id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Parenting Event not found" });
      }
  
      return res.json({
        message: "Updated successfully!",
        data: updatedEvent,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  // Function to generate a random hex color code
function generateRandomLightHexColorWithOpacity() {
  const letters = "CDEF"; // Constrain to lighter colors
  let color = "#";

  // Generate a light color by using letters from C to F for each color channel
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }

  // Add an alpha value for opacity (optional)
  // You can adjust the range from '00' to 'FF' where 'FF' is fully opaque.
  const opacity = "80"; // Example opacity value (50% opacity)

  // Combine the color with the opacity
  return color + opacity;
}

module.exports = {
    addParenting,
    getParenting,
    getParentingById,
    deleteParenting,
    editParenting
};
