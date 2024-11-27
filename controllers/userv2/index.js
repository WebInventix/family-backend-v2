const { User_Auth_Schema } = require("../../models/user_auth_model");
const { CPBridge } = require("../../models/bridgeCoParent");
const { Family } = require("../../models/family");
const { Posts } = require("../../models/posts");


const addCP = async (req, res) => {
    try {
        const { family_id, first_name, email, last_name } = req.body;
        const { user_id } = req

        const check_user = await User_Auth_Schema.findOne({ email });
        if (check_user) {
            let bridge = await new CPBridge({
                add_by: user_id,
                cp_id: check_user._id,
            })
            await bridge.save()


        }
        else
        {
            let coP = await new User_Auth_Schema({
                first_name,
                last_name,
                email,
                user_role:'Parent'
            })
            await coP.save()
            let bridge = await new CPBridge({
                    add_by: user_id,
                    cp_id: coP._id
                })
            await bridge.save()
        }
        return res.status(200).json({message:'Co-Parent Added Successfully'})
    } catch (error) {
        return res.status(500).json({ message: error.message})    
    }

}

const getCp = async (req, res) => {
    try {
        const { user_id } = req;
        const cp = await CPBridge.find({ add_by: user_id }).populate('cp_id');
        return res.status(200).json({ cp });
        
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}


module.exports = {
    addCP,
    getCp
};