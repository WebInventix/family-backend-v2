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

const listEvents = async (req,res) => {
    const {user_id} = req
    try {
        const events = await Events.find({user_id}).populate('user_id').populate('children').populate('relative').populate('family_id')
        return res.status(200).json({success:true,events})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

const eventById = async (req,res) => {
    const {event_id} = req.params
    try {
        const event = await Events.findById(event_id).populate('user_id').populate('children').populate('relative').populate('family_id')
        return res.status(200).json({success:true,event})
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


module.exports = {
    addEvents,
    listEvents,
    eventById

};