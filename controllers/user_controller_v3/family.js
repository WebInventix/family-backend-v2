const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")


const addFamily = async (req,res) => {
    const {user_id,body} = req
    const {family_name, co_parent, relatives,children} = body
    try {
        const family = await Families.create({created_by:user_id,family_name,co_parent,relatives,children})
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
  
module.exports = {
addFamily,
listFamilies

};