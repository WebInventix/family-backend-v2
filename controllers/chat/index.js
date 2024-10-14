
const Message = require('../../models/Message')


const addMessage = async (req, res) => {
    const { company, sender, receiver, msg } = req.body;

    // Log the incoming request for debugging
    console.log('Incoming request data:', { company, sender, receiver, msg });

    try {
        // Create a room ID based on sender and receiver
        let room = `${sender}-${receiver}`;

        // Log the room ID for debugging
        console.log('Generated room ID:', room);

        // Create a new message instance
        const message = new Message({
            companyId: company,
            senderId: sender,
            receiverId: receiver,
            content: msg,
            roomId: room
        });

        // Save the message to the database
        await message.save();

        // If successful, return a success response
        return res.status(201).json({
            message: 'Message sent successfully',
            data: message,
            rule: true
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Error saving message:', error);

        // Return a 500 error response with detailed error message
        return res.status(500).json({
            message: 'Error sending message',
            data: error.message || error,  // Provide a more detailed error message
            rule: false
        });
    }
};
0
module.exports = {

    addMessage

};
