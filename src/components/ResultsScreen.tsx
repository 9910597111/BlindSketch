import React from 'react';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { Player } from '../types/game';

interface ResultsScreenProps {
  players: Record<string, Player>;
  scores: Record<string, number>;
  winner: string;
  currentPlayerId: string;
  isHost: boolean;
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  players,
  scores,
  winner,
  currentPlayerId,
  isHost,
  onPlayAgain,
  onLeaveRoom
}) => {
  const sortedPlayers = Object.values(players).sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });

  const winnerName = players[winner]?.name || 'Sconosciuto';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold text-black">Partita Finita!</h1>
          </div>
          
          <div className="text-2xl text-gray-600 mb-4">
            Vincitore: <span className="text-orange-500 font-bold">{winnerName}</span>
          </div>
          
          {winner === currentPlayerId && (
            <div className="text-xl text-green-600 font-semibold">
              🎉 Congratulazioni! Hai vinto! 🎉
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Classifica Finale</h2>
          
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-6 rounded-lg transition-colors ${
                  index === 0
                    ? 'bg-yellow-100 border-2 border-yellow-400'
                    : index === 1
                    ? 'bg-gray-100 border-2 border-gray-400'
                    : index === 2
                    ? 'bg-orange-100 border-2 border-orange-400'
                    : 'bg-white border-2 border-gray-200'
                } ${
                  player.id === currentPlayerId ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                      ? 'bg-gray-500'
                      : index === 2
                      ? 'bg-orange-500'
                      : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="font-bold text-lg text-black">
                      {player.name}
                      {player.id === currentPlayerId && (
                        <span className="ml-2 text-sm text-orange-500">(Tu)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-black mr-2">
                    {scores[player.id] || 0}
                  </span>
                  <span className="text-gray-600">punti</span>
                  {index < 3 && (
                    <Star className={`w-6 h-6 ml-2 ${
                      index === 0 ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          {isHost && (
            <button
              onClick={onPlayAgain}
              className="flex items-center px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Gioca Ancora
            </button>
          )}
          
          <button
            onClick={onLeaveRoom}
            className="flex items-center px-8 py-4 bg-gray-200 text-black text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-6 h-6 mr-2" />
            Torna al Menu
          </button>
        </div>
        
        {!isHost && (
          <div className="text-center mt-6 text-gray-600">
            In attesa che l'host decida se giocare di nuovo...
          </div>
        )}
      </div>
    </div>
  );
};