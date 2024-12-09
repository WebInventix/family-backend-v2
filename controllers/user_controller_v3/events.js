const {Events} = require("../../models/v3/Events")


const addEvents = async (req,res) => {
    const {user_id, body} = req
    const {children,relative,name,startDate,endDate,isMeeting,place,notes,attachment,family_id} = body

    try {
        if(children.length==0 || !name || !startDate || !endDate )
        {
            return res.status(400).json({message: "Please fill all the fields"})
        }
        const eventData = {
            user_id,
            children,
            relative,
            name,
            startDate,
            endDate,
            isMeeting,
            place,
            notes,
            attachment,
            family_id
          };
      
          const newEvent = new Events(eventData);
          await newEvent.save();
      
          return res.status(201).json({ success: true, event: newEvent });
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}


const updateEvent = async (req, res) => {
    const { id } = req.params; // Event ID from the URL
    const { body } = req;
    const { children, relative, name, startDate, endDate, isMeeting, place, notes, attachment, family_id } = body;

    try {
        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Ensure required fields are provided
        if (children?.length === 0 || !name || !startDate || !endDate) {
            return res.status(400).json({ message: "Please fill all the required fields" });
        }

        // Find the event by ID and update it
        const updatedEvent = await Events.findByIdAndUpdate(
            id,
            {
                children,
                relative,
                name,
                startDate,
                endDate,
                isMeeting,
                place,
                notes,
                attachment,
                family_id,
            },
            { new: true } // Return the updated event
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ success: true, event: updatedEvent });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const listEvents = async (req,res) => {
    const {family_id} = req.params
    try {
        
        const events = await Events.find({family_id}).populate('user_id').populate('children').populate('relative').populate('family_id')
        return res.status(200).json({success:true,events})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

const eventById = async (req,res) => {
    const {id} = req.params
    try {
        const event = await Events.findById(id).populate('user_id').populate('children').populate('relative').populate('family_id')
        return res.status(200).json({success:true,event})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


const deleteEvent = async (req, res) => {
    const { id } = req.params; // Extract the event ID from the URL

    try {
        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Find and delete the event by ID
        const deletedEvent = await Events.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



module.exports = {
    addEvents,
    listEvents,
    eventById,
    updateEvent,
    deleteEvent

};