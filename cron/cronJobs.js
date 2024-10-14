// cronjobs.js
const cron = require('node-cron');
const {User_Auth_Schema} = require('../models/user_auth_model'); // Adjust the path as needed

// Schedule the cron job to run every 3 minutes
cron.schedule('*/1 * * * *', async () => {
    try {
        const twoMinutesAgo = new Date();
        twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

        // Update users based on subscription status and creation date
        const result = await User_Auth_Schema.updateMany(
            {
                subscription_status: 'Trail', // Ensure this matches the exact value in your database
                createdAt: { $lte: twoMinutesAgo } // Check users created more than 2 minutes ago
            },
            { $set: { verified: false } }
        );

        console.log(`Cron job executed: ${result.modifiedCount} user(s) updated.`);
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});
