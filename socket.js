const Message = require("./models/Message.js");
const setupSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("User Connected", socket.id);
      
        socket.on("message", async ({ roomId, message, senderId, receiverId,companyId }) => {
          console.log({ roomId, message, senderId, receiverId, companyId });
          const newMessage = new Message({
            content: message,
            roomId,
            senderId,
            receiverId,
            companyId,
            createdAt: new Date(),
          });
          await newMessage.save();
          io.to(roomId).emit("receive-message", { content: message, senderId, receiverId, companyId });
        });
      
        socket.on("join-room", (roomId) => {
          socket.join(roomId);
          console.log(`User joined room ${roomId}`);
        });
      
        socket.on("fetch-messages", async ({ roomId,companyId }) => {
          const messages = await Message.find({ roomId,companyId }).sort({ createdAt: 1 });
          socket.emit("previous-messages", messages);
        });
      
        socket.on("disconnect", () => {
          console.log("User Disconnected", socket.id);
        });
      });
};

module.exports = setupSocket;
