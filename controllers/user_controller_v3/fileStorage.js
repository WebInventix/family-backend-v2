const { User_Auth_Schema } = require("../../models/user_auth_model");
const {Members} = require("../../models/v3/members")
const {Families} = require("../../models/v3/families")
const {File} = require("../../models/v3/File")



const addFile = async (req, res) => {
    const { file, family_id } = req.body;

    try {
        // Validate input
        if (!file || !family_id) {
            return res.status(400).json({ message: "File and family_id are required." });
        }

        // Get all co-parents from the Families collection
        const family = await Families.findById(family_id).populate("co_parents");
        if (!family) {
            return res.status(404).json({ message: "Family not found." });
        }

        // Prepare users array
        const users = family.co_parents.map((coParent) => ({
            user_id: coParent.user_id,
            is_deleted: false
        }));
        users.push({user_id:family.created_by,is_deleted:false})
        // Create a new file record
        const newFile = new File({
            file,
            family_id,
            users
        });

        // Save to the database
        await newFile.save();

        return res.status(201).json({ message: "File added successfully.", file: newFile });
    } catch (error) {
        console.error("Error adding file:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteFile = async (req, res) => {
    const { file_id } = req.params; // File ID should be passed as a route parameter
    const { user_id } = req; // User ID of the co-parent attempting to delete

    try {
        // Find the file by ID
        const file = await File.findById(file_id);
        if (!file) {
            return res.status(404).json({ message: "File not found." });
        }

        // Check if the user is part of the family and update the is_deleted field
        const user = file.users.find((u) => u.user_id.toString() === user_id);
        if (!user) {
            return res.status(403).json({ message: "You are not authorized to delete this file." });
        }

        user.is_deleted = true;

        // Check if all co-parents have approved deletion
        const allApproved = file.users.every((u) => u.is_deleted);

        if (allApproved) {
            // Delete the file from the database
            await File.findByIdAndDelete(file_id);
            return res.status(200).json({ message: "File deleted successfully." });
        }

        // Save the updated file record
        await file.save();

        return res.status(200).json({ message: "Deletion request noted. Waiting for other co-parents' approval.", file });
    } catch (error) {
        console.error("Error deleting file:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const fileListintByFamily = async(req,res) => {
    const { family_id } = req.params; // Family ID should be passed as a route parameter
    try {
        const files = await File.find({ family_id }).populate('family_id').populate('users.user_id','first_name last_name');
        return res.status(200).json({ files });
        
    } catch (error) {
        
    }
}
module.exports= {
    addFile,
    deleteFile,
    fileListintByFamily
}