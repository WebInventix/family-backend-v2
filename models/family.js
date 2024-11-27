const mongoose = require('mongoose');

const { Schema } = mongoose;

const otherFamily = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref:'user',
        required: false
    },
    relation: {
        type: String,
        enum: [
            'Sibling', 'Spouse', 'Co-Parent',
            'Grandparent', 'Grandchild', 'Aunt/Uncle', 'Niece/Nephew', 
            'Cousin', 'Step-Parent', 'Step-Sibling', 'In-Law', 'Guardian', 'Foster Parent'
        ],
        required: true
    },
    name: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});



const Family = mongoose.model('family', new Schema({
    name: {
        type: String,
        default:null,
    },
    parent_1:{
        type: String,
        default:null,
        ref: 'user'
    },
    parent_2:{
        type: String,
        default:null,
        ref: 'user'
    },
    color_code:{
        type:String,
        default:null
    },
    other_family: [otherFamily],  // Array of comments
          
}, { timestamps: true }
))


module.exports = { Family }
