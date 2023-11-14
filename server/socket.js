const User = require("./models/userModels");
module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();

  const getUserIdBySocketId = (socketId) => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return null;
  };

  io.on("connection", (socket) => {
    socket.on("add-user", async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.broadcast.emit("user-online", userId);

      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit("get-users", onlineUserIds);

      try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", {
          message: data.message,
          createdAt: data.createdAt,
        });
      }
    });

    socket.on("disconnect", async () => {
      const disconnectedUserId = getUserIdBySocketId(socket.id);
      if (disconnectedUserId) {
        if (onlineUsers.delete(disconnectedUserId)) {
          socket.broadcast.emit("user-offline", disconnectedUserId);

          try {
            await User.findByIdAndUpdate(disconnectedUserId, {
              isOnline: false,
            });
          } catch (error) {
            console.error("Error updating user status:", error);
          }
        }
      }
    });
  });

  return io;
};
