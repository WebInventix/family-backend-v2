const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")
const {Parentingv3} = require("../../models/v3/parenting")

// const getParentingView = async (req,res) => {
//     const {body,user_id,user_data} = req
//     const {
//         child_ids, children_spend_the_night_with_the_creator,
//         children_spend_the_weekend_with_the_creator,days,ends_at,
//         exchange_day,model_id,starts_at,the_creator_has_the_main_custody,
//         weekend_end_day,weekend_end_time,weekend_start_day,weekend_start_time,
//         co_parent,family_id
//     } = body
//     try {
//         if(!model_id)
//         {
//             return res.status(400).json({message:"Model id is required"})
//         }
        
//         if(model_id=="1")
//         {

//         }
//         else
//         {
//             return res.status(400).json({message:"Invalid model id"})
//         }

//         return res.status(200).json({message:"working",family})    
//     } catch (error) {
//         return res.status(500).json({message:"Internal Server Error", error:error.message})
        
//     }
    
// }


const getParentingView = async (req, res) => {
    const { body, user_id, user_data } = req;
    const {
        child_ids, children_spend_the_night_with_the_creator,
        children_spend_the_weekend_with_the_creator,days,ends_at,
        exchange_day,model_id,starts_at,the_creator_has_the_main_custody,
        weekend_end_day,weekend_end_time,weekend_start_day,weekend_start_time,
        co_parent,family_id
    } = body;

    try {

        const member = await Members.findOne({ added_by: user_id, user_id:co_parent });
        if(!member)
        {
            return res.status(400).json({message:"CoParent not found"})

        }

        // Validation
        if (!model_id) {
            return res.status(400).json({ message: "Model id is required" });
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(starts_at);
        const endDate = new Date(ends_at);
        // endDate.setDate(startDate.getDate() + 14);
        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: "Invalid start or end date" });
        }

        // Initialize variables
        const schedule = [];
        let currentRole = children_spend_the_night_with_the_creator ? "Parent" : "Co-Parent";
        let currentId = children_spend_the_night_with_the_creator ? user_id : co_parent;

        let currentDate = new Date(startDate);
        let currentColor = currentRole == "Parent" ? "Orange" : member.color_code
        // Function to get day of the week (0 = Sunday, 1 = Monday, ... 6 = Saturday)
        const getDayOfWeek = (date) => date.getDay();





        if (model_id == "1") 
            {
            
                // Iterate over dates from startDate to endDate
                while (currentDate <= endDate) {
                    schedule.push({
                        date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                        role: currentRole == "Parent" ? currentRole+`-${user_data.first_name}`:currentRole+`-${member.first_name}`,
                        id: currentId,
                        color_code: currentColor
                    });

                    // Check if it's exchange day
                    if (getDayOfWeek(currentDate) === exchange_day) {
                        // Switch roles
                        currentRole = currentRole === "Parent" ? "Co-Parent" : "Parent";
                        currentId = currentRole === "Parent" ? user_id : co_parent;
                        currentColor = currentRole === "Parent"? "Orange": member.color_code
                    }

                    // Move to the next day
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return res.status(200).json({data:schedule, body:body});
        } else if (model_id == "2") {
            const weekendStartDay = weekend_start_day;
            const weekendEndDay = weekend_end_day;
        
            // Determine initial role based on weekend and main custody
            currentRole = the_creator_has_the_main_custody ? "Parent" : "Co-Parent";
            currentId = the_creator_has_the_main_custody ? user_id : co_parent;
            currentColor = currentRole == "Parent" ? "Orange" : member.color_code;
        
            // Helper function to check if a day is part of the weekend
            const isWeekend = (date) => {
                const dayOfWeek = date.getDay();
                
                if (weekendStartDay < weekendEndDay) {
                    return dayOfWeek >= weekendStartDay && dayOfWeek <= weekendEndDay;
                }
                // For weekend crossing over Sunday (e.g., Sat-Mon)
                return dayOfWeek >= weekendStartDay || dayOfWeek <= weekendEndDay;
            };
        
            // Determine if weekends alternate
            let currentWeekendWith = children_spend_the_weekend_with_the_creator
                ? "Parent"
                : "Co-Parent";
            

            // console.log(isWeekend(currentDate))
            
            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
        
                // Check if the current day is part of the weekend
                if (isWeekend(currentDate)) {
                    currentRole = currentWeekendWith;
                    currentId = currentWeekendWith === "Parent" ? user_id : co_parent;
                    currentColor = currentRole === "Parent" ? "Orange" : member.color_code;
                } else {
                    // Non-weekend days, the role follows the main custody
                    currentRole = the_creator_has_the_main_custody ? "Parent" : "Co-Parent";
                    currentId = currentRole === "Parent" ? user_id : co_parent;
                    currentColor = currentRole === "Parent" ? "Orange" : member.color_code;
                }
        
                schedule.push({
                    date: currentDate.toISOString().split("T")[0],
                    role: currentRole == "Parent" ? currentRole+`-${user_data.first_name}`:currentRole+`-${member.first_name}`,
                    id: currentId,
                    color_code: currentColor
                });
        
                // If it's the last day of the weekend, alternate the weekend ownership
                if (isWeekend(currentDate) && dayOfWeek === weekendEndDay) {
                    currentWeekendWith = currentWeekendWith === "Parent" ? "Co-Parent" : "Parent";
                }
        
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        
            return res.status(200).json({ data: schedule, body: body });
        }

        return res.status(200).json({message:"working on different model"})
        
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




// Create a new Parenting record
const createParenting = async (req, res) => {
    const { user_id } = req; // Assuming user_id is coming from auth middleware or session
    try {
      const parentingData = { ...req.body, user_id }; // Append user_id to the request body
      const newParenting = new Parentingv3(parentingData);
      await newParenting.save();
      res.status(201).json({
        success: true,
        message: 'Parenting record created successfully',
        data: newParenting,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating parenting record',
        error: error.message,
      });
    }
  };

// Get all Parenting records
const getAllParenting = async (req, res) => {
    try {
      const parentingRecords = await Parentingv3.find({ user_id: req.user_id }).populate('child_ids').populate('co_parent').populate('family_id');
      res.status(200).json({
        success: true,
        message: 'Parenting records retrieved successfully',
        data: parentingRecords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving parenting records',
        error: error.message,
      });
    }
  };


  const getAllParentingByFamily = async (req, res) => {
    const {family_id} = req.params
    try {
      const parentingRecords = await Parentingv3.find({ family_id: family_id }).populate('child_ids').populate('co_parent').populate('family_id');
      res.status(200).json({
        success: true,
        message: 'Parenting records retrieved successfully',
        data: parentingRecords,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving parenting records',
        error: error.message,
      });
    }
  };

// Get a single Parenting record by ID
const getParentingById = async (req, res) => {
    try {
      const { id } = req.params;
      const parentingRecord = await Parentingv3.findOne({ _id: id, user_id: req.user_id }).populate('child_ids').populate('co_parent').populate('family_id');
      if (!parentingRecord) {
        return res.status(404).json({
          success: false,
          message: 'Parenting record not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Parenting record retrieved successfully',
        data: parentingRecord,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving parenting record',
        error: error.message,
      });
    }
  };

// Update a Parenting record
const updateParenting = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedParenting = await Parentingv3.findOneAndUpdate(
        { _id: id, user_id: req.user_id },
        updatedData,
        { new: true }
      );
      if (!updatedParenting) {
        return res.status(404).json({
          success: false,
          message: 'Parenting record not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Parenting record updated successfully',
        data: updatedParenting,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating parenting record',
        error: error.message,
      });
    }
  };

// Delete a Parenting record
const deleteParenting = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedParenting = await Parentingv3.findOneAndDelete({ _id: id, user_id: req.user_id });
      if (!deletedParenting) {
        return res.status(404).json({
          success: false,
          message: 'Parenting record not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Parenting record deleted successfully',
        data: deletedParenting,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting parenting record',
        error: error.message,
      });
    }
  };






module.exports = {
    getParentingView,
    createParenting,
    getAllParenting,
    getParentingById,
    updateParenting,
    deleteParenting,
    getAllParentingByFamily
};