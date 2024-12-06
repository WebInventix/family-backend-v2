const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")


const addFamily = async (req,res) => {
    const {user_id,body} = req
    const {family_name, co_parents, relatives,children} = body
    try {
        const family = await Families.create({created_by:user_id,family_name,co_parents,relatives,children})
        return res.json({message:"Family Added Successfully",data:family})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}

const listFamilies = async (req, res) => {
    try {
      const families = await Families.find()
        .populate({
          path: 'created_by',
          select: '_id first_name last_name email user_id',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .populate({
          path: 'co_parents',
          select: '_id first_name last_name email user_id',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .populate({
          path: 'children',
          select: '_id first_name last_name email user_id',
          populate: {
            path: 'user_id',
            select: '_id name email',
          },
        })
        .populate({
          path: 'relatives',
          select: '_id first_name last_name email user_id',
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
  
    try {
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
        .populate('co_parents', 'first_name last_name relation')
        .populate('relatives', 'first_name last_name relation')
        .populate('children', 'first_name last_name relation')
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
module.exports = {
addFamily,
listFamilies,
getFamily

};