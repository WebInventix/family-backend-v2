const mongoose = require('mongoose');
const { Schema } = mongoose;

const FileSchema = new Schema(
    {
        file: {
            type: String,
            required: true,
            trim: true,
        },
        family_id: {
            type: Schema.Types.ObjectId,
            ref: 'families',
            required: true,
        },
        users: [
            {
                user_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'user',
                    required: true,
                },
                is_deleted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const File = mongoose.model('files', FileSchema);

module.exports = { File };
