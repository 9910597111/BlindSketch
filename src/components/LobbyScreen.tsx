import React from 'react';
import { Users, Settings, Play, Copy, Crown, Check } from 'lucide-react';
import { Room, Player } from '../types/game';

interface LobbyScreenProps {
  room: Room;
  currentPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  currentPlayerId,
  isHost,
  onStartGame,
  onLeaveRoom
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy room ID:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = room.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const playersList = Object.values(room.players);
  const canStart = playersList.length >= 2;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Lobby di Gioco</h1>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
            <span>ID Stanza:</span>
            <span className="font-mono font-bold text-orange-500 text-2xl">{room.id}</span>
            <button
              onClick={copyRoomId}
              className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
              title="Copia ID stanza"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">Copiato!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copia</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Condividi questo ID con i tuoi amici per farli entrare nella stanza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Players List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-xl font-bold text-black">
                  Giocatori ({playersList.length}/{room.settings.maxPlayers})
                </h2>
              </div>
              
              <div className="space-y-3">
                {playersList.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-black">{player.name}</span>
                        {player.id === currentPlayerId && (
                          <span className="ml-2 text-sm text-orange-500">(Tu)</span>
                        )}
                      </div>
                    </div>
                    
                    {player.id === room.host && (
                      <div className="flex items-center text-yellow-600">
                        <Crown className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold">Host</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: room.settings.maxPlayers - playersList.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500"
                  >
                    In attesa di giocatori...
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Settings and Controls */}
          <div className="space-y-6">
            {/* Settings Display */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-xl font-bold text-black">Impostazioni</h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giocatori:</span>
                  <span className="font-semibold">{room.settings.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Round:</span>
                  <span className="font-semibold">{room.settings.rounds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo disegno:</span>
                  <span className="font-semibold">{room.settings.drawTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scelte parole:</span>
                  <span className="font-semibold">{room.settings.wordChoices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Indizi lettere:</span>
                  <span className="font-semibold">{room.settings.letterHints}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isHost && (
                <button
                  onClick={onStartGame}
                  disabled={!canStart}
                  className="w-full flex items-center justify-center px-6 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  {canStart ? 'Inizia Partita' : 'Servono almeno 2 giocatori'}
                </button>
              )}
              
              {!isHost && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    In attesa che l'host inizi la partita...
                  </p>
                </div>
              )}
              
              <button
                onClick={onLeaveRoom}
                className="w-full px-6 py-3 bg-gray-200 text-black font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Lascia Stanza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};