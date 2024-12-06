const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const { generateRandomPassword } = require("../../utils/passwordGenerator");
const { sendWelcomeEmailCoParent } = require("../../utils/email");
const { Bcrypt_Service } = require("../../services/bcrypt_services");

const addChild = async (req, res) => {
const {user_id, body} = req;
const {first_name, last_name, email, number, dob, gender, info, color_code,additional_info} = body; 

    try {
    const child = new Members({
      first_name,
      last_name,
      email,
      number,
      dob,
      info,
      color_code,
      gender,
      additional_info,
      added_by:user_id,
      relation:"Child"
    });

    await child.save();
    return res
      .status(200)
      .json({ message: "Child Added Successfully", child: child });
  } catch (error) {
    return res.status(300).json({ message: error.message });
  }
}


const updateChild = async (req, res) => {
    const { child_id } = req.params; // ID of the child to be updated
    const { body } = req; // Updated data
    
    try {
      // Find the child by ID and update the fields
      const updatedChild = await Members.findByIdAndUpdate(
        child_id,
        { ...body }, // Spread operator to update all provided fields
        { new: true, runValidators: true } // Return the updated document and validate fields
      );
  
      if (!updatedChild) {
        return res.status(404).json({ message: "Child not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Child Updated Successfully", child: updatedChild });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


  const listChildren = async (req, res) => {
    const { user_id } = req; // Assuming user_id is available in the request object
  
    try {
      // Query to find all children added by the user
      const children = await Members.find({ added_by: user_id, relation: "Child" });
  
      if (children.length === 0) {
        return res.status(404).json({ message: "No children found." });
      }
  
      return res
        .status(200)
        .json({ message: "Children retrieved successfully", children });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



  const addRelative = async (req, res) => {
    const {user_id, body} = req;
    const {first_name, last_name, email, color_code,relation} = body; 
    
        try {
        const relative = new Members({
          first_name,
          last_name,
          email,
          color_code,
          added_by:user_id,
          relation:relation
        });
    
        await relative.save();
        return res
          .status(200)
          .json({ message: "Relative Added Successfully", relative: relative });
      } catch (error) {
        return res.status(300).json({ message: error.message });
      }
    }



    const updateRelative = async (req, res) => {
        const { relative_id } = req.params; // ID of the child to be updated
        const { body } = req; // Updated data
        
        try {
          // Find the child by ID and update the fields
          const updatedRelative = await Members.findByIdAndUpdate(
            relative_id,
            { ...body }, // Spread operator to update all provided fields
            { new: true, runValidators: true } // Return the updated document and validate fields
          );
      
          if (!updatedRelative) {
            return res.status(404).json({ message: "Relative not found" });
          }
      
          return res
            .status(200)
            .json({ message: "Relative Updated Successfully", relative: updatedRelative });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      };


    const listRelative = async (req, res) => {
    const { user_id } = req; // Assuming user_id is available in the request object
    
        try {
            // Query to find all relatives added by the user where relation is not "Child" or "Co-Parent"
            const relatives = await Members.find({
            added_by: user_id,
            relation: { $nin: ["Child", "Co-Parent"] }
            });
        
            if (relatives.length === 0) {
            return res.status(404).json({ message: "No Relative found." });
            }
        
            return res
            .status(200)
            .json({ message: "Relatives retrieved successfully", relatives });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };


const viewMember = async (req,res) => {
   const { id } = req.params
    try {
        const member = await Members.findById(id)
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
            }
            return res.status(200).json({ data : member });
        
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}



const addCoparent = async (req,res) => {
  const {user_id,body} = req 
  const {first_name, last_name,email, color_code } = body
  try {
    if(!email)
    {
      return res.status(400).json({ message: "Email is required" });
    }
    const existingUser = await User_Auth_Schema.findOne({ email })
    if(existingUser)
    {
      const co_parent = new Members({
        user_id:existingUser._id,
        first_name,
        last_name,
        email,
        color_code,
        added_by:user_id,
        relation:'Co-Parent'
      });
  
      await relative.save();
      

    }
    else
    {
      let password = generateRandomPassword();
      const secure_password = await Bcrypt_Service.bcrypt_hash_password(password);
      const newUser = new User_Auth_Schema({
        email,
        first_name,
        last_name,
        user_role: "Parent",
        password: secure_password,
      });

      await newUser.save();
      await sendWelcomeEmailCoParent(email, first_name, password);
      const co_parent = new Members({
        user_id: newUser._id,
        first_name,
        last_name,
        email,
        color_code,
        added_by:user_id,
        relation:'Co-Parent'
      })
      
      await co_parent.save();
      return res
        .status(200)
        .json({ message: "Co-Parent Added Successfully & Invitation sent to email", co_parent: co_parent });
    }
    
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}


const listCp = async (req,res) => {
  const {user_id} = req
  try {
    const co_parents = await Members.find({added_by:user_id,relation:'Co-Parent'})
    return res.status(200).json({co_parents})
    
  } catch (error) {
    return res.status(500).json({ message: error.message })
    
  }
}


const getMembers = async (req, res) => {
  const { user_id } = req;

  try {
    // Find members where added_by equals user_id
    const members = await Members.find({ added_by: user_id }).lean();

    // Group members based on their relation
    const groupedMembers = {
      co_parents: members.filter((member) => member.relation === 'Co-Parent'),
      children: members.filter((member) => member.relation === 'Child'),
      relatives: members.filter(
        (member) => member.relation !== 'Co-Parent' && member.relation !== 'Child'
      ),
    };

    return res.json({
      message: 'Members fetched successfully',
      data: groupedMembers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
    addChild,
    updateChild,
    listChildren,
    addRelative,
    updateRelative,
    listRelative,
    viewMember,
    addCoparent,
    listCp,
    getMembers

};