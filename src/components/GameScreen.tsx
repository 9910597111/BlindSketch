import React, { useState, useEffect } from 'react';
import { Timer, Palette, Users, MessageCircle } from 'lucide-react';
import { DrawingCanvas } from './DrawingCanvas';
import { Chat } from './Chat';
import { PlayerList } from './PlayerList';
import { WordSelector } from './WordSelector';
import { GameState, Room, ChatMessage } from '../types/game';

interface GameScreenProps {
  room: Room;
  gameState: GameState;
  currentPlayerId: string;
  isDrawer: boolean;
  wordChoices: string[];
  messages: ChatMessage[];
  onDraw: (data: any) => void;
  onSelectWord: (word: string) => void;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  room,
  gameState,
  currentPlayerId,
  isDrawer,
  wordChoices,
  messages,
  onDraw,
  onSelectWord,
  onSendMessage,
  onLeaveRoom
}) => {
  const [timeLeft, setTimeLeft] = useState(room.settings.drawTime);
  const [showWordSelector, setShowWordSelector] = useState(false);

  useEffect(() => {
    if (room.gameState === 'choosing' && isDrawer && wordChoices.length > 0) {
      setShowWordSelector(true);
    } else {
      setShowWordSelector(false);
    }
  }, [room.gameState, isDrawer, wordChoices]);

  useEffect(() => {
    if (room.gameState === 'playing') {
      setTimeLeft(room.settings.drawTime);
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [room.gameState, room.settings.drawTime]);

  const handleWordSelect = (word: string) => {
    onSelectWord(word);
    setShowWordSelector(false);
  };

  const displayWord = () => {
    if (!gameState.currentWord) return '';
    
    let display = gameState.currentWord.split('').map((char, index) => {
      if (char === ' ') return ' ';
      
      const revealed = gameState.revealedLetters.find(r => r.index === index);
      return revealed ? revealed.letter : '_';
    }).join(' ');
    
    return display;
  };

  const currentDrawerName = gameState.currentDrawer ? 
    room.players[gameState.currentDrawer]?.name : '';

  if (showWordSelector && wordChoices.length > 0) {
    return (
      <WordSelector
        words={wordChoices}
        onSelectWord={handleWordSelect}
        timeLeft={10} // Give 10 seconds to choose
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-black">BlindSketch</h1>
            
            <div className="flex items-center text-gray-600">
              <span className="font-semibold">Round {gameState.round}/{gameState.totalRounds}</span>
            </div>
            
            {room.gameState === 'playing' && (
              <div className="flex items-center text-orange-500">
                <Timer className="w-5 h-5 mr-2" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {isDrawer ? (
                <span className="text-orange-500 font-semibold">È il tuo turno!</span>
              ) : (
                <span>Sta disegnando: <strong>{currentDrawerName}</strong></span>
              )}
            </div>
            
            <button
              onClick={onLeaveRoom}
              className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
        
        {/* Word Display */}
        {gameState.currentWord && (
          <div className="mt-4 text-center">
            <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border">
              <span className="text-2xl font-mono font-bold text-black tracking-wider">
                {isDrawer ? gameState.currentWord : displayWord()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex h-screen">
        {/* Left Sidebar - Player List */}
        <div className="w-64 bg-gray-50 border-r border-gray-200">
          <PlayerList
            players={room.players}
            scores={gameState.scores}
            currentDrawer={gameState.currentDrawer}
            currentPlayerId={currentPlayerId}
          />
        </div>

        {/* Center - Drawing Canvas */}
        <div className="flex-1 flex items-center justify-center p-8">
          <DrawingCanvas
            canvas={gameState.canvas}
            isDrawer={isDrawer}
            isBlinded={isDrawer}
            onDraw={onDraw}
          />
        </div>

        {/* Right Sidebar - Chat */}
        <div className="w-80 bg-gray-50 border-l border-gray-200">
          <Chat
            messages={messages}
            currentPlayerId={currentPlayerId}
            onSendMessage={onSendMessage}
            disabled={isDrawer}
          />
        </div>
      </div>
    </div>
  );
};