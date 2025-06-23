import React from 'react';
import { Crown, Palette } from 'lucide-react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Record<string, Player>;
  scores: Record<string, number>;
  currentDrawer: string | null;
  currentPlayerId: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  scores,
  currentDrawer,
  currentPlayerId
}) => {
  const sortedPlayers = Object.values(players).sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-semibold text-black text-lg">Giocatori</h3>
      </div>

      {/* Player List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border-2 transition-colors ${
              player.id === currentPlayerId
                ? 'border-orange-500 bg-orange-50'
                : currentDrawer === player.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-black text-sm">
                    {player.name}
                    {player.id === currentPlayerId && (
                      <span className="ml-1 text-xs text-orange-500">(Tu)</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {scores[player.id] || 0} punti
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {index === 0 && (
                  <Crown className="w-4 h-4 text-yellow-500" title="Primo posto" />
                )}
                {currentDrawer === player.id && (
                  <Palette className="w-4 h-4 text-green-500" title="Sta disegnando" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};