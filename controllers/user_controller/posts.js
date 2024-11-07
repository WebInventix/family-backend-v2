const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Childrens } = require("../../models/ChildModel");
const { Family } = require("../../models/family");
const { Posts } = require("../../models/posts");

const addPost = async (req, res) => {
    try {
        const { body, user_id } = req;
        const { post } =  body;

        let posted_by = user_id


        // Create a new post
        const newPost = new Posts({
            post,
            posted_by
        });

        // Save the post to the database
        await newPost.save();

        res.status(200).json({ success: true, message: 'Post added successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding post', error });
    }
};


const postLikes = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        // Find the post by ID
        const post = await Posts.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

            // If user has already liked the post, remove the like
            if (post.likes.includes(userId)) {
                post.likes.pull(userId);
            } else {
                // Add the like if user hasn't liked the post already
                post.likes.push(userId);
            }
        // Save the updated post
        await post.save();

        res.status(200).json({ success: true, message: 'Post reaction updated successfully', post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating post reaction', error });
    }
};

const getAllPostsWithLikes = async (req, res) => {
    try {
        // Fetch all posts and populate the 'likes' field with user details
        const posts = await Posts.find().populate('likes', 'first_name email').populate('comments.commented_by', 'first_name email user_profile'); // Assuming 'username' and 'email' fields exist in the user model

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving posts', error });
    }
};



const addComment = async (req, res) => {
    try {
        const { postId, userId, comment } = req.body;

        // Find the post by ID
        const post = await Posts.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Create a new comment
        const newComment = {
            comment,
            commented_by: userId,
            created_at: new Date()
        };

        // Add the comment to the post
        post.comments.push(newComment);

        // Save the updated post
        await post.save();
        let  completePost = await Posts.findById(postId).populate('likes', 'first_name email').populate('comments.commented_by', 'first_name email user_profile');
        res.status(200).json({ success: true, message: 'Comment added successfully', completePost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding comment', error });
    }
};

const getSinglePost =  async (req, res) => {
const {id} = req.params
try {
    const post = await Posts.findById(id).populate('likes', 'first_name email').populate('comments.commented_by', 'first_name email user_profile');
    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found'})
    }
     res.status(200).json({ success: true, post });
    
} catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching post', error})
    
}
}

module.exports = {
    addPost,
    postLikes,
    getAllPostsWithLikes,
    addComment,
    getSinglePost 

};