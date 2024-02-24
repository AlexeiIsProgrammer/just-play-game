import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import styles from './App.module.scss';

type PlayerType = 'X' | 'O';

function App() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [board, setBoard] = useState<PlayerType[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [player, setPlayer] = useState<'X' | 'O'>('X');
  const [currentMove, setCurrentMove] = useState<'X' | 'O' | null>(null);
  const socket = useRef<null | Socket>(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL);

    socket.current.on('showSessions', (sessions) => {
      setSessions(sessions);
    });

    socket.current.on('sessionCreated', (sessionId) => {
      setSessions([...sessions, sessionId]);
    });

    socket.current.on('sessionJoined', (sessionId, isFirstPlayer) => {
      setPlayer(isFirstPlayer ? 'X' : 'O');
      setCurrentSession(sessionId);
    });

    socket.current.on('userDisconnect', () => {
      setCurrentSession('');
    });

    socket.current.on('sessionFull', () => {
      setCurrentMove('X');
    });

    socket.current.on('resetGame', () => {
      setBoard(Array(9).fill(null));
      setWinner(null);
      setCurrentMove('X');
    });

    socket.current.on('sessionNotFound', () => {
      alert('Session not found!');
    });

    socket.current.on('move', (currentMove, board) => {
      handleRemoteMove(currentMove, board);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const createSession = () => {
    if (socket.current) socket.current.emit('createSession');
  };

  const joinSession = (sessionId: string) => {
    if (socket.current) {
      socket.current.emit('joinSession', sessionId);
    }
  };

  const makeMove = (ind: number) => {
    if (
      board[ind] === null &&
      !winner &&
      currentSession &&
      socket.current &&
      currentMove === player
    ) {
      socket.current.emit('move', {
        sessionId: currentSession,
        board,
        ind,
        currentMove,
      });
    }
  };

  const handleRemoteMove = (
    currentMove: 'X' | 'O',
    currentBoard: PlayerType[]
  ) => {
    setCurrentMove(currentMove);
    setBoard(currentBoard);
    checkWinner(currentBoard);
  };

  const checkWinner = (board: PlayerType[]) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        break;
      }
    }
  };

  const resetGame = () => {
    socket.current?.emit('resetGame', currentSession);
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {currentSession ? (
        <>
          <div className={styles.board}>
            {board.map((cell, ind) => (
              <div
                key={ind}
                className={styles.cell}
                onClick={() => makeMove(ind)}
              >
                {cell}
              </div>
            ))}
          </div>
          <div className="status">
            {winner
              ? `Winner: ${winner}`
              : currentMove
                ? `Next Player: ${currentMove}`
                : ''}
          </div>
          <button onClick={resetGame}>Reset Game</button>
        </>
      ) : (
        <>
          <h2>Create or Join a Session</h2>
          <button onClick={() => createSession()}>Create Session</button>
          <div>
            <h3>Join Session:</h3>
            <ul>
              {sessions.map((sessionId) => (
                <li key={sessionId}>
                  <button onClick={() => joinSession(sessionId)}>
                    Join {sessionId}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
