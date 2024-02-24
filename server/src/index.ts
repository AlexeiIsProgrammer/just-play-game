import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {config} from "dotenv";
import getUniqueId from "./utils/getUniqueId";

config();

const app = express();

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.REACT_APP_FRONTEND_URL || "http://localhost:5173"],
  },
});

type PlayerType = "X" | "O";

type SessionType = {
  users: string[];
};

type SessionsType = {
  [key: string]: SessionType;
};

const sessions: SessionsType = {};

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log(sessions);

  io.emit("showSessions", Object.keys(sessions));

  socket.on("createSession", () => {
    const sessionId = getUniqueId();
    sessions[sessionId] = {users: [socket.id]};

    socket.join(sessionId);
    io.emit("sessionCreated", sessionId);
    io.to(socket.id).emit("sessionJoined", sessionId, true);
  });

  socket.on("resetGame", (sessionId) => {
    io.to(sessionId).emit("resetGame");
  });

  socket.on("joinSession", (sessionId) => {
    if (sessions[sessionId].users && sessions[sessionId].users.length < 2) {
      sessions[sessionId].users.push(socket.id);
      socket.join(sessionId);

      io.to(socket.id).emit("sessionJoined", sessionId);
      io.to(sessionId).emit("sessionFull");

      io.emit(
        "showSessions",
        Object.keys(sessions).filter((session) => session !== sessionId)
      );
    } else {
      io.to(socket.id).emit("sessionNotFound");
    }
  });

  socket.on("move", ({sessionId, board, ind, currentMove}: {sessionId: string; board: PlayerType[]; ind: number; currentMove: "X" | "O"}) => {
    board[ind] = currentMove;
    io.to(sessionId).emit("move", currentMove === "X" ? "O" : "X", board);
  });

  socket.on("disconnect", () => {
    for (const sessionId in sessions) {
      const disconnectedSession = sessions[sessionId].users.find((id) => id === socket.id);
      console.log(sessions);
      console.log(disconnectedSession);

      if (disconnectedSession) {
        io.to(sessionId).emit("userDisconnect");
        delete sessions[sessionId];
      }
    }
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
