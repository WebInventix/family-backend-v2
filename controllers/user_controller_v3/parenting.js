const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")

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
    const { body, user_id } = req;
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
                        role: currentRole,
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
        } else if (model_id == "2")
        {
            //code here chat gpt
        }

        return res.status(200).json({message:"working on different model"})
        
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    getParentingView
};