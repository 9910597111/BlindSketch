export interface Player {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
  host: string;
  settings: RoomSettings;
  gameState: 'lobby' | 'playing' | 'choosing' | 'finished';
}

export interface RoomSettings {
  maxPlayers: number;
  rounds: number;
  drawTime: number;
  wordChoices: number;
  letterHints: number;
}

export interface DrawPoint {
  x: number;
  y: number;
  type: 'start' | 'draw' | 'end';
  color?: string;
  size?: number;
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  message: string;
  isCorrect?: boolean;
  timestamp?: number;
}

export interface GameState {
  currentDrawer: string | null;
  currentWord: string | null;
  canvas: DrawPoint[];
  scores: Record<string, number>;
  revealedLetters: Array<{ index: number; letter: string }>;
  round: number;
  totalRounds: number;
}