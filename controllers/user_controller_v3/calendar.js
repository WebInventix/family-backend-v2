const { Events } = require("../../models/v3/Events");
const { Parentingv3 } = require("../../models/v3/parenting");
const { Members } = require("../../models/v3/members");

const generateParentingSchedule = async ({
    user_id,
    co_parent,
    model_id,
    starts_at,
    ends_at,
    exchange_day,
    the_creator_has_the_main_custody,
    children_spend_the_night_with_the_creator,
    weekend_start_day,
    weekend_end_day,
    children_spend_the_weekend_with_the_creator
}) => {
    try {
        const member = await Members.findOne({ added_by: user_id, user_id: co_parent });
        if (!member) {
            throw new Error("CoParent not found");
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(starts_at);
        const endDate = new Date(ends_at);
        if (isNaN(startDate) || isNaN(endDate)) {
            throw new Error("Invalid start or end date");
        }

        // Initialize variables
        const schedule = [];
        let currentRole = children_spend_the_night_with_the_creator ? "Parent" : "Co-Parent";
        let currentId = children_spend_the_night_with_the_creator ? user_id : co_parent;
        let currentColor = currentRole === "Parent" ? "Orange" : member.color_code;

        let currentDate = new Date(startDate);

        // Helper function to get day of the week
        const getDayOfWeek = (date) => date.getDay();

        // Model 1: Daily switching with exchange day
        if (model_id === "1") {
            while (currentDate <= endDate) {
                schedule.push({
                    date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
                    role: currentRole,
                    id: currentId,
                    color_code: currentColor
                });

                // Check if it's exchange day
                if (getDayOfWeek(currentDate) === exchange_day) {
                    currentRole = currentRole === "Parent" ? "Co-Parent" : "Parent";
                    currentId = currentRole === "Parent" ? user_id : co_parent;
                    currentColor = currentRole === "Parent" ? "Orange" : member.color_code;
                }

                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return schedule;
        }

        // Model 2: Weekend-based switching
        if (model_id === "2") {
            const isWeekend = (date) => {
                const dayOfWeek = date.getDay();
                if (weekend_start_day < weekend_end_day) {
                    return dayOfWeek >= weekend_start_day && dayOfWeek <= weekend_end_day;
                }
                return dayOfWeek >= weekend_start_day || dayOfWeek <= weekend_end_day;
            };

            let currentWeekendWith = children_spend_the_weekend_with_the_creator ? "Parent" : "Co-Parent";

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();

                if (isWeekend(currentDate)) {
                    currentRole = currentWeekendWith;
                    currentId = currentWeekendWith === "Parent" ? user_id : co_parent;
                    currentColor = currentRole === "Parent" ? "Orange" : member.color_code;
                } else {
                    currentRole = the_creator_has_the_main_custody ? "Parent" : "Co-Parent";
                    currentId = currentRole === "Parent" ? user_id : co_parent;
                    currentColor = currentRole === "Parent" ? "Orange" : member.color_code;
                }

                schedule.push({
                    date: currentDate.toISOString().split("T")[0],
                    role: currentRole,
                    id: currentId,
                    color_code: currentColor
                });

                if (isWeekend(currentDate) && dayOfWeek === weekend_end_day) {
                    currentWeekendWith = currentWeekendWith === "Parent" ? "Co-Parent" : "Parent";
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
            return schedule;
        }

        return [];
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCalendar = async (req, res) => {
    const { user_id } = req; // Assuming `user_id` is added to the request object via middleware
    const { family_id } = req.params;

    try {
        const parenting = await Parentingv3.find({ family_id }).lean();
        for (let i = 0; i < parenting.length; i++) {
            const parentingRecord = parenting[i];
            try {
                const parentingSchedule = await generateParentingSchedule({
                    user_id,
                    co_parent: parentingRecord.co_parent,
                    model_id: parentingRecord.model_id,
                    starts_at: parentingRecord.starts_at,
                    ends_at: parentingRecord.ends_at,
                    exchange_day: parentingRecord.exchange_day,
                    the_creator_has_the_main_custody: parentingRecord.the_creator_has_the_main_custody,
                    children_spend_the_night_with_the_creator: parentingRecord.children_spend_the_night_with_the_creator,
                    weekend_start_day: parentingRecord.weekend_start_day,
                    weekend_end_day: parentingRecord.weekend_end_day,
                    children_spend_the_weekend_with_the_creator: parentingRecord.children_spend_the_weekend_with_the_creator
                });
                parentingRecord.schedule = parentingSchedule;
            } catch (error) {
                console.error(`Error generating schedule for parenting record ${parentingRecord._id}:`, error.message);
                parentingRecord.schedule = [];
            }
        }

        const events = await Events.find({ family_id }).populate("user_id children");

        return res.status(200).json({ parenting, events });
    } catch (error) {
        console.error("Error in getCalendar:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getCalendar,
};
