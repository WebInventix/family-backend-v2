const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")


const addFamily = async (req,res) => {
    const {user_id,body} = req
    const {family_name, co_parents, relatives,children,color_code} = body
    try {
        const family = await Families.create({created_by:user_id,family_name,co_parents,relatives,children,color_code})
        return res.json({message:"Family Added Successfully",data:family})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}
const updateFamily = async (req, res) => {
  const { id } = req.params; // Assuming family_id is passed as a route parameter
  const { body } = req; // The request body contains the fields to update

  try {
      // Find the family by its ID
      const family = await Families.findById(id);

      if (!family) {
          return res.status(404).json({ message: "Family not found" });
      }

      // Update only the fields provided in the body
      const updatedData = {
          family_name: body.family_name || family.family_name,
          co_parents: body.co_parents || family.co_parents,
          relatives: body.relatives || family.relatives,
          children: body.children || family.children,
          color_code: body.color_code || family.color_code
      };

      // Update the family document
      Object.assign(family, updatedData);
      await family.save();

      return res.json({ message: "Family updated successfully", data: family });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};
const listFamilies = async (req, res) => {
    try {
      const families = await Families.find()
        .populate('created_by','_id first_name last_name email')
        .populate({
          path: 'co_parents',
          select: '_id first_name last_name email user_id relation color_code',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .populate({
          path: 'children',
          select: '_id first_name last_name email user_id relation dob gender info additional_info color_code',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .populate({
          path: 'relatives',
          select: '_id first_name last_name email user_id relation color_code',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .lean();
  
      return res.json({
        message: 'Families fetched successfully',
        data: families,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  


  const getFamily = async (req, res) => {
    const { user_id } = req;
    const {all} = req.query
  
    try {
      if(all && all=="false")
      {
        let myFamily  = await Families.find({created_by:user_id}).populate('created_by', 'first_name last_name email')
        .populate('co_parents', '_id first_name last_name email user_id relation color_code')
        .populate('relatives', '_id first_name last_name email user_id relation color_code')
        .populate('children', '_id first_name last_name email user_id relation dob gender info additional_info color_code')
        .lean();
        return res.json({
          message: 'Families fetched successfully',
          data: myFamily,
        });
      }
  
      // Step 1: Find all member IDs associated with the user_id
      const members = await Members.find({ user_id }).lean();
  
      // Step 2: Extract the member IDs
      const memberIds = members.map(member => member._id);
      
      
      // Step 3: Build the query
      let query = {};
  
      if (memberIds.length > 0) {
        // User is associated with multiple members; fetch families where:
        // - created_by = user_id
        // - OR member._id is in co_parents, relatives, or children
        query = {
          $or: [
            { created_by: user_id },
            { co_parents: { $in: memberIds } },
            { relatives: { $in: memberIds } },
            { children: { $in: memberIds } },
          ],
        };
      } else {
        // User is not associated with any member; fetch families created by user_id
        query = { created_by: user_id };
      }
  
      // Step 4: Fetch families with population
      const families = await Families.find(query)
        .populate('created_by', 'first_name last_name email')
        .populate('co_parents', '_id first_name last_name email user_id relation color_code')
        .populate('relatives', '_id first_name last_name email user_id relation color_code')
        .populate('children', '_id first_name last_name email user_id relation dob gender info additional_info color_code')
        .lean();
  
      return res.json({
        message: 'Families fetched successfully',
        data: families,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };


const getById = async(req,res)=>{
  const {id} = req.params
  try {
    const family = await Families.findById(id).populate('created_by', 'first_name last_name email')
    .populate('co_parents', '_id first_name last_name email user_id relation color_code')
    .populate('relatives', '_id first_name last_name email user_id relation color_code')
    .populate('children', '_id first_name last_name email user_id relation dob gender info additional_info color_code')
    .lean();

  return res.json({
    message: 'Families fetched successfully',
    data: family,
  });
    
  } catch (error) {
    return res.status(500).json({message:error.message})
    
  }
}

const deleteFamily = async (req, res) => {
  const { id } = req.params; // Extract the Family ID from the URL

  try {
      if (!id) {
          return res.status(400).json({ message: "Family ID is required" });
      }

      // Find and delete the Family by ID
      const deletedFamily = await Families.findByIdAndDelete(id);

      if (!deletedFamily) {
          return res.status(404).json({ message: "Family not found" });
      }

      return res.status(200).json({ success: true, message: "Family deleted successfully" });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};



module.exports = {
addFamily,
listFamilies,
getFamily,
getById,
updateFamily,
deleteFamily
};