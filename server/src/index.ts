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

type TypeOfGame = "ttt" | "sea";

type PlayerType = "X" | "O";

type UserType = {
  id: string;
  name: string;
};

type SessionType = {
  users: UserType[];
  type: "ttt" | "sea";
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
      ...sessions[session],
    }))
  );

  socket.on("createSession", (type: TypeOfGame, name) => {
    const sessionId = getUniqueId();
    const newSession = {users: [{id: socket.id, name}], type};
    sessions[sessionId] = newSession;

    socket.join(sessionId);

    const newClientSession = {...newSession, id: sessionId};

    io.emit("sessionCreated", newClientSession);

    if (type === "ttt") {
      io.to(socket.id).emit("tic-tac-toe:sessionJoined", newClientSession, true);
    } else {
      io.to(socket.id).emit("sea-battle:sessionJoined", newClientSession, true);
    }
  });

  socket.on("tic-tac-toe:resetGame", (session: string) => {
    io.to(session).emit("tic-tac-toe:resetGame");
  });

  socket.on("sea-battle:resetGame", (session: string) => {
    io.to(session).emit("sea-battle:resetGame");
  });

  socket.on("joinSession", (sessionId: string, name: string, type: TypeOfGame) => {
    if (sessions[sessionId].users && sessions[sessionId].users.length < 2) {
      sessions[sessionId].users.push({id: socket.id, name});
      socket.join(sessionId);

      const newClientSession = {...sessions[sessionId], id: sessionId};

      if (type === "ttt") {
        io.to(socket.id).emit("tic-tac-toe:sessionJoined", newClientSession);
        io.to(sessionId).emit("tic-tac-toe:sessionFull", newClientSession);
      } else {
        io.to(socket.id).emit("sea-battle:sessionJoined", newClientSession);
        io.to(sessionId).emit("sea-battle:sessionFull", newClientSession);
      }

      io.emit(
        "showSessions",
        Object.keys(sessions).map((session) => ({
          id: session,
          ...sessions[session],
        }))
      );
    } else {
      io.to(socket.id).emit("sessionNotFound");
    }
  });

  socket.on("tic-tac-toe:move", ({session, board, ind, currentMove}: {session: string; board: PlayerType[]; ind: number; currentMove: "X" | "O"}) => {
    board[ind] = currentMove;

    io.to(session).emit("tic-tac-toe:move", currentMove === "X" ? "O" : "X", board);
  });

  socket.on("sea-battle:move", ({session, board, ind, currentMove}: {session: string; board: PlayerType[]; ind: number; currentMove: "X" | "O"}) => {
    board[ind] = currentMove;
    io.to(session).emit("sea-battle:move", currentMove === "X" ? "O" : "X", board);
  });

  const disconnectUser = () => {
    for (const sessionId in sessions) {
      const disconnectedSession = sessions[sessionId].users.find(({id}) => id === socket.id);

      if (disconnectedSession) {
        io.to(sessionId).emit("userDisconnect");
        delete sessions[sessionId];

        io.emit(
          "showSessions",
          Object.keys(sessions).map((session) => ({
            id: session,
            ...sessions[session],
          }))
        );
      }
    }
  };

  socket.on("disconnect", disconnectUser);

  socket.on("disconnectUser", disconnectUser);
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
