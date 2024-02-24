import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {config} from "dotenv";
import getUniqueId from "./utils/getUniqueId";

config();

const app = express();

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

  io.emit(
    "showSessions",
    Object.keys(sessions).map((session) => ({
      id: session,
      users: sessions[session].users,
    }))
  );

  socket.on("createSession", () => {
    const sessionId = getUniqueId();
    const newSession = {users: [socket.id]};
    sessions[sessionId] = newSession;

    socket.join(sessionId);

    const newClientSession = {...newSession, id: sessionId};

    io.emit("sessionCreated", newClientSession);
    io.to(socket.id).emit("sessionJoined", newClientSession, true);
  });

  socket.on("resetGame", (session: string) => {
    io.to(session).emit("resetGame");
  });

  socket.on("joinSession", (sessionId) => {
    if (sessions[sessionId].users && sessions[sessionId].users.length < 2) {
      sessions[sessionId].users.push(socket.id);
      socket.join(sessionId);

      const newClientSession = {...sessions[sessionId], id: sessionId};

      io.to(socket.id).emit("sessionJoined", newClientSession);
      io.to(sessionId).emit("sessionFull", newClientSession);

      io.emit(
        "showSessions",
        Object.keys(sessions)
          .map((session) => ({
            id: session,
            users: sessions[session].users,
          }))
          .filter((session) => session.id !== sessionId)
      );
    } else {
      io.to(socket.id).emit("sessionNotFound");
    }
  });

  socket.on("move", ({session, board, ind, currentMove}: {session: string; board: PlayerType[]; ind: number; currentMove: "X" | "O"}) => {
    board[ind] = currentMove;
    io.to(session).emit("move", currentMove === "X" ? "O" : "X", board);
  });

  socket.on("disconnect", () => {
    for (const sessionId in sessions) {
      const disconnectedSession = sessions[sessionId].users.find((id) => id === socket.id);

      if (disconnectedSession) {
        io.to(sessionId).emit("userDisconnect", sessionId);
        delete sessions[sessionId];
      }
    }
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
