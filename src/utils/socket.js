const socket = require("socket.io");
const Message = require("../Models/chat");
const Chat = require("../Models/chat");
const ConnectionRequest = require("../Models/connectionRequest");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");
          //check if user id and target user id are frieds
          const connectionRequest = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (!connectionRequest) {
            throw new Error("the users are not friends");
          }

          //save message

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initSocket;
