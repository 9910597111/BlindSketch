import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);

// Get allowed origins from environment or use defaults
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    rooms: rooms.size,
    connections: io.engine.clientsCount
  });
});

// In-memory storage for game state
const rooms = new Map();
const publicRooms = new Set();

// Word lists for different categories
const WORD_LISTS = {
  easy: ['casa', 'gatto', 'sole', 'auto', 'libro', 'cane', 'pizza', 'mare', 'fiore', 'bici'],
  medium: ['astronauta', 'chitarra', 'elefante', 'computer', 'ombrello', 'telefono', 'montagna', 'biblioteca', 'supermercato', 'aeroplano'],
  hard: ['pescivendolo', 'architetto', 'paleontologia', 'microscopia', 'filosofia', 'ingegneria', 'astronomia', 'neurologia', 'botanica', 'archeologia']
};

function createRoom(settings = {}) {
  const roomId = uuidv4().slice(0, 8).toUpperCase();
  const defaultSettings = {
    maxPlayers: 6,
    rounds: 3,
    drawTime: 60,
    wordChoices: 3,
    letterHints: 2
  };
  
  const room = {
    id: roomId,
    settings: { ...defaultSettings, ...settings },
    players: new Map(),
    host: null,
    gameState: 'lobby', // lobby, playing, finished
    currentRound: 0,
    currentDrawer: null,
    currentWord: null,
    wordChoices: [],
    canvas: [],
    scores: new Map(),
    timer: null,
    revealedLetters: []
  };
  
  rooms.set(roomId, room);
  console.log(`Room created: ${roomId}, Total rooms: ${rooms.size}`);
  return room;
}

function getRandomWords(count = 3) {
  const allWords = [...WORD_LISTS.easy, ...WORD_LISTS.medium, ...WORD_LISTS.hard];
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function selectNextDrawer(room) {
  const playerIds = Array.from(room.players.keys());
  if (playerIds.length === 0) return null;
  
  const currentIndex = room.currentDrawer ? playerIds.indexOf(room.currentDrawer) : -1;
  const nextIndex = (currentIndex + 1) % playerIds.length;
  return playerIds[nextIndex];
}

function startRound(room) {
  room.currentDrawer = selectNextDrawer(room);
  room.wordChoices = getRandomWords(room.settings.wordChoices);
  room.currentWord = null;
  room.canvas = [];
  room.revealedLetters = [];
  room.gameState = 'choosing';
  
  io.to(room.id).emit('roundStart', {
    drawer: room.currentDrawer,
    round: room.currentRound + 1,
    totalRounds: room.settings.rounds
  });
  
  io.to(room.currentDrawer).emit('wordChoices', room.wordChoices);
}

function revealLetters(room) {
  if (!room.currentWord || room.revealedLetters.length >= room.settings.letterHints) return;
  
  const word = room.currentWord.toLowerCase();
  const availableIndices = [];
  
  for (let i = 0; i < word.length; i++) {
    if (word[i] !== ' ' && !room.revealedLetters.includes(i)) {
      availableIndices.push(i);
    }
  }
  
  if (availableIndices.length > 0) {
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    room.revealedLetters.push(randomIndex);
    
    io.to(room.id).emit('letterRevealed', {
      index: randomIndex,
      letter: word[randomIndex]
    });
  }
}

function checkWinner(room, guess, playerId) {
  if (!room.currentWord || playerId === room.currentDrawer) return false;
  
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedWord = room.currentWord.toLowerCase();
  
  if (normalizedGuess === normalizedWord) {
    // Award points
    const guesserScore = room.scores.get(playerId) || 0;
    const drawerScore = room.scores.get(room.currentDrawer) || 0;
    
    room.scores.set(playerId, guesserScore + 100);
    room.scores.set(room.currentDrawer, drawerScore + 50);
    
    io.to(room.id).emit('wordGuessed', {
      winner: playerId,
      word: room.currentWord,
      scores: Object.fromEntries(room.scores)
    });
    
    endRound(room);
    return true;
  }
  
  return false;
}

function endRound(room) {
  if (room.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
  
  room.currentRound++;
  
  if (room.currentRound >= room.settings.rounds) {
    // Game finished
    room.gameState = 'finished';
    const finalScores = Object.fromEntries(room.scores);
    const winner = Array.from(room.scores.entries()).reduce((a, b) => a[1] > b[1] ? a : b);
    
    io.to(room.id).emit('gameFinished', {
      scores: finalScores,
      winner: winner[0]
    });
  } else {
    // Next round
    setTimeout(() => {
      if (rooms.has(room.id)) {
        startRound(room);
      }
    }, 3000);
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('createRoom', (data) => {
    console.log('Creating room for:', data);
    const { playerName, settings } = data;
    const room = createRoom(settings);
    
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName
    });
    room.host = socket.id;
    room.scores.set(socket.id, 0);
    
    socket.join(room.id);
    
    console.log(`Room ${room.id} created by ${playerName}`);
    
    socket.emit('roomCreated', {
      roomId: room.id,
      isHost: true
    });
    
    socket.emit('roomUpdate', {
      players: Object.fromEntries(room.players),
      host: room.host,
      settings: room.settings,
      gameState: room.gameState
    });
  });
  
  socket.on('joinRoom', (data) => {
    console.log('Joining room:', data);
    const { roomId, playerName } = data;
    const room = rooms.get(roomId);
    
    if (!room) {
      console.log(`Room ${roomId} not found`);
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (room.players.size >= room.settings.maxPlayers) {
      console.log(`Room ${roomId} is full`);
      socket.emit('error', { message: 'Room is full' });
      return;
    }
    
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName
    });
    room.scores.set(socket.id, 0);
    
    socket.join(roomId);
    
    console.log(`${playerName} joined room ${roomId}`);
    
    socket.emit('roomJoined', {
      roomId: roomId,
      isHost: socket.id === room.host
    });
    
    io.to(roomId).emit('roomUpdate', {
      players: Object.fromEntries(room.players),
      host: room.host,
      settings: room.settings,
      gameState: room.gameState
    });
    
    // If game is in progress, send current state
    if (room.gameState === 'playing') {
      socket.emit('gameState', {
        currentDrawer: room.currentDrawer,
        currentWord: room.currentWord ? room.currentWord.replace(/./g, '_') : null,
        canvas: room.canvas,
        scores: Object.fromEntries(room.scores),
        revealedLetters: room.revealedLetters,
        round: room.currentRound,
        totalRounds: room.settings.rounds
      });
    }
  });
  
  socket.on('startGame', () => {
    // Find room where this socket is the host
    for (const room of rooms.values()) {
      if (room.host === socket.id && room.gameState === 'lobby') {
        room.gameState = 'playing';
        room.currentRound = 0;
        
        console.log(`Game started in room ${room.id}`);
        
        io.to(room.id).emit('gameStarted');
        startRound(room);
        break;
      }
    }
  });
  
  socket.on('selectWord', (data) => {
    const { word } = data;
    
    for (const room of rooms.values()) {
      if (room.currentDrawer === socket.id && room.gameState === 'choosing') {
        room.currentWord = word;
        room.gameState = 'playing';
        
        const wordDisplay = word.replace(/./g, '_');
        
        console.log(`Word selected in room ${room.id}: ${word}`);
        
        io.to(room.id).emit('wordSelected', {
          word: wordDisplay,
          length: word.length
        });
        
        // Start timer
        room.timer = setTimeout(() => {
          endRound(room);
        }, room.settings.drawTime * 1000);
        
        // Schedule letter reveals
        const revealInterval = (room.settings.drawTime * 1000) / (room.settings.letterHints + 1);
        for (let i = 1; i <= room.settings.letterHints; i++) {
          setTimeout(() => {
            if (rooms.has(room.id) && room.gameState === 'playing') {
              revealLetters(room);
            }
          }, revealInterval * i);
        }
        
        break;
      }
    }
  });
  
  socket.on('draw', (data) => {
    for (const room of rooms.values()) {
      if (room.currentDrawer === socket.id && room.gameState === 'playing') {
        room.canvas.push(data);
        socket.to(room.id).emit('draw', data);
        break;
      }
    }
  });
  
  socket.on('chatMessage', (data) => {
    const { message } = data;
    
    for (const room of rooms.values()) {
      if (room.players.has(socket.id)) {
        const player = room.players.get(socket.id);
        const isCorrectGuess = checkWinner(room, message, socket.id);
        
        io.to(room.id).emit('chatMessage', {
          playerId: socket.id,
          playerName: player.name,
          message: message,
          isCorrect: isCorrectGuess
        });
        break;
      }
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from all rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        room.scores.delete(socket.id);
        
        // If host left, assign new host
        if (room.host === socket.id && room.players.size > 0) {
          room.host = Array.from(room.players.keys())[0];
        }
        
        // If room is empty, delete it
        if (room.players.size === 0) {
          if (room.timer) clearTimeout(room.timer);
          rooms.delete(roomId);
          publicRooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        } else {
          io.to(roomId).emit('roomUpdate', {
            players: Object.fromEntries(room.players),
            host: room.host,
            settings: room.settings,
            gameState: room.gameState
          });
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});