import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {config} from "dotenv";
import getUniqueId from "./utils/getUniqueId";
import {checkSeaBattleWinner} from "./utils/checkSeaBattlerWinner";
import {PlayerType, SeaBattlePlayerType, SessionsType, TypeOfGame} from "./types";
import isShipFullyDestroyed from "./utils/isShipFullyDestroyed";

config();

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.REACT_APP_FRONTEND_URL || "http://localhost:5173"],
  },
});

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
    sessions[session].users.map((user) => ({...user, board: null}));
    io.to(session).emit("sea-battle:resetGame");
  });

  socket.on("sea-battle:ready", (session: string, board: SeaBattlePlayerType[], userId: string) => {
    sessions[session].ready = (sessions[session].ready || 0) + 1;
    const currentUser = sessions[session].users.find((user) => user.id === userId);
    if (currentUser) {
      currentUser.board = board;
    }

    if ((sessions[session].ready || 0) > 1) {
      io.to(session).emit("sea-battle:ready");
    }
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

  socket.on("sea-battle:move", ({session, ind, currentMove, userId}: {session: string; board: SeaBattlePlayerType[]; ind: number; currentMove: "X" | "O"; userId: string}) => {
    const opponentUser = sessions[session].users.filter((user) => user.id !== userId)[0];

    let nextMove = currentMove;
    if (opponentUser.board) {
      if (opponentUser.board[ind] === "K") {
        opponentUser.board[ind] = "X";

        isShipFullyDestroyed(opponentUser.board, ind);

        if (checkSeaBattleWinner(opponentUser.board)) {
          io.to(session).emit("sea-battle:win", currentMove);
        }
      } else {
        nextMove = currentMove === "X" ? "O" : "X";
        opponentUser.board[ind] = "O";
      }

      io.to(userId).emit(
        "sea-battle:move",
        nextMove,
        opponentUser.board.map((cell) => (cell === "K" ? null : cell))
      );
      io.to(sessions[session].users.filter((user) => user.id !== userId)[0].id).emit("sea-battle:changeMove", nextMove, opponentUser.board);
    }
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
