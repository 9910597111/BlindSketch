import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Room, GameState, ChatMessage } from './types/game';

type AppState = 'home' | 'lobby' | 'game' | 'results';

function App() {
  const socket = useSocket();
  const [appState, setAppState] = useState<AppState>('home');
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [winner, setWinner] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string>('');

  useEffect(() => {
    if (!socket) return;

    // Set current player ID
    setCurrentPlayerId(socket.id || '');

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionError('');
      setCurrentPlayerId(socket.id || '');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError('Impossibile connettersi al server. Assicurati che il server sia in esecuzione.');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setConnectionError('Connessione persa con il server.');
    });

    socket.on('roomCreated', (data) => {
      console.log('Room created:', data);
      setIsHost(data.isHost);
      setAppState('lobby');
      setConnectionError('');
    });

    socket.on('roomJoined', (data) => {
      console.log('Room joined:', data);
      setIsHost(data.isHost);
      setAppState('lobby');
      setConnectionError('');
    });

    socket.on('roomUpdate', (data) => {
      console.log('Room update:', data);
      setRoom(data);
    });

    socket.on('gameStarted', () => {
      console.log('Game started');
      setAppState('game');
      setMessages([]);
    });

    socket.on('roundStart', (data) => {
      console.log('Round start:', data);
      setGameState(prev => prev ? {
        ...prev,
        currentDrawer: data.drawer,
        round: data.round
      } : null);
    });

    socket.on('wordChoices', (words) => {
      console.log('Word choices received:', words);
      setWordChoices(words);
    });

    socket.on('wordSelected', (data) => {
      console.log('Word selected:', data);
      setGameState(prev => prev ? {
        ...prev,
        currentWord: data.word
      } : null);
      setWordChoices([]);
    });

    socket.on('draw', (drawData) => {
      setGameState(prev => prev ? {
        ...prev,
        canvas: [...prev.canvas, drawData]
      } : null);
    });

    socket.on('chatMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, { ...message, timestamp: Date.now() }]);
    });

    socket.on('letterRevealed', (data) => {
      setGameState(prev => prev ? {
        ...prev,
        revealedLetters: [...prev.revealedLetters, data]
      } : null);
    });

    socket.on('wordGuessed', (data) => {
      setGameState(prev => prev ? {
        ...prev,
        scores: data.scores
      } : null);
    });

    socket.on('gameFinished', (data) => {
      setGameState(prev => prev ? {
        ...prev,
        scores: data.scores
      } : null);
      setWinner(data.winner);
      setAppState('results');
    });

    socket.on('gameState', (state) => {
      console.log('Game state received:', state);
      setGameState(state);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setConnectionError(error.message || 'Errore di connessione');
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('roomUpdate');
      socket.off('gameStarted');
      socket.off('roundStart');
      socket.off('wordChoices');
      socket.off('wordSelected');
      socket.off('draw');
      socket.off('chatMessage');
      socket.off('letterRevealed');
      socket.off('wordGuessed');
      socket.off('gameFinished');
      socket.off('gameState');
      socket.off('error');
    };
  }, [socket]);

  // Initialize game state when entering game
  useEffect(() => {
    if (appState === 'game' && room && !gameState) {
      setGameState({
        currentDrawer: null,
        currentWord: null,
        canvas: [],
        scores: {},
        revealedLetters: [],
        round: 1,
        totalRounds: room.settings.rounds
      });
    }
  }, [appState, room, gameState]);

  const handleCreateRoom = (playerName: string, settings: any) => {
    if (socket && socket.connected) {
      console.log('Emitting createRoom event');
      socket.emit('createRoom', { playerName, settings });
    } else {
      setConnectionError('Non connesso al server. Impossibile creare la stanza.');
    }
  };

  const handleJoinRoom = (playerName: string, roomId?: string) => {
    if (socket && socket.connected) {
      if (roomId) {
        console.log('Emitting joinRoom event');
        socket.emit('joinRoom', { playerName, roomId });
      } else {
        setConnectionError('Inserisci un ID stanza per entrare');
      }
    } else {
      setConnectionError('Non connesso al server. Impossibile entrare nella stanza.');
    }
  };

  const handleStartGame = () => {
    if (socket && socket.connected) {
      socket.emit('startGame');
    }
  };

  const handleSelectWord = (word: string) => {
    if (socket && socket.connected) {
      socket.emit('selectWord', { word });
    }
  };

  const handleDraw = (data: any) => {
    if (socket && socket.connected) {
      socket.emit('draw', data);
    }
  };

  const handleSendMessage = (message: string) => {
    if (socket && socket.connected) {
      socket.emit('chatMessage', { message });
    }
  };

  const handleLeaveRoom = () => {
    setRoom(null);
    setGameState(null);
    setMessages([]);
    setWordChoices([]);
    setWinner('');
    setConnectionError('');
    setAppState('home');
  };

  const handlePlayAgain = () => {
    if (socket && socket.connected) {
      socket.emit('startGame');
      setAppState('game');
      setGameState(null);
      setMessages([]);
      setWinner('');
    }
  };

  // Determine if current player is the drawer
  const isDrawer = gameState?.currentDrawer === currentPlayerId;

  return (
    <div className="min-h-screen bg-white">
      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-500 text-white p-4 text-center">
          <p className="font-semibold">{connectionError}</p>
          <p className="text-sm mt-1">
            Assicurati che il server sia in esecuzione su localhost:3001
          </p>
        </div>
      )}

      {appState === 'home' && (
        <HomeScreen
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
        />
      )}
      
      {appState === 'lobby' && room && (
        <LobbyScreen
          room={room}
          currentPlayerId={currentPlayerId}
          isHost={isHost}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      
      {appState === 'game' && room && gameState && (
        <GameScreen
          room={room}
          gameState={gameState}
          currentPlayerId={currentPlayerId}
          isDrawer={isDrawer}
          wordChoices={wordChoices}
          messages={messages}
          onDraw={handleDraw}
          onSelectWord={handleSelectWord}
          onSendMessage={handleSendMessage}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      
      {appState === 'results' && room && gameState && (
        <ResultsScreen
          players={room.players}
          scores={gameState.scores}
          winner={winner}
          currentPlayerId={currentPlayerId}
          isHost={isHost}
          onPlayAgain={handlePlayAgain}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;