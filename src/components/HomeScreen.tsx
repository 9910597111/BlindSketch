import React, { useState } from 'react';
import { Users, Settings, Gamepad2, AlertCircle } from 'lucide-react';

interface HomeScreenProps {
  onJoinRoom: (playerName: string, roomId?: string) => void;
  onCreateRoom: (playerName: string, settings: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onJoinRoom, onCreateRoom }) => {
  const [playerName, setPlayerName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomSettings, setRoomSettings] = useState({
    maxPlayers: 6,
    rounds: 3,
    drawTime: 60,
    wordChoices: 3,
    letterHints: 2
  });

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      console.log('Creating room with settings:', roomSettings);
      onCreateRoom(playerName.trim(), roomSettings);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim()) {
      console.log('Joining room:', roomId || 'random');
      onJoinRoom(playerName.trim(), roomId.trim() || undefined);
    }
  };

  // Check if we're in a deployed environment without server
  const isDeployedWithoutServer = !window.location.hostname.includes('localhost') && 
                                  !import.meta.env.VITE_SERVER_URL;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-16 h-16 text-orange-500 mr-4" />
            <h1 className="text-6xl font-bold text-black">BlindSketch</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Disegna senza vedere quello che stai tracciando mentre gli altri tentano di indovinare!
          </p>
        </div>

        {/* Server Connection Warning */}
        {isDeployedWithoutServer && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-semibold text-yellow-800">Modalità Demo</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Per giocare online, è necessario avviare il server locale. 
                  Scarica il codice e segui le istruzioni nel README.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Player Name Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-black mb-3">
            Il tuo nome
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="Inserisci il tuo nome..."
            maxLength={20}
          />
        </div>

        {/* Main Action Buttons */}
        {!showCreateRoom && !showJoinRoom && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setShowCreateRoom(true)}
              disabled={!playerName.trim()}
              className="flex items-center justify-center px-8 py-6 bg-orange-500 text-white text-xl font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              <Settings className="w-6 h-6 mr-3" />
              Crea Stanza Privata
            </button>
            
            <button
              onClick={() => setShowJoinRoom(true)}
              disabled={!playerName.trim()}
              className="flex items-center justify-center px-8 py-6 bg-black text-white text-xl font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              <Users className="w-6 h-6 mr-3" />
              Entra in Stanza
            </button>
          </div>
        )}

        {/* Create Room Settings */}
        {showCreateRoom && (
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Impostazioni Stanza</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Numero Giocatori (2-8)
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={roomSettings.maxPlayers}
                  onChange={(e) => setRoomSettings({
                    ...roomSettings,
                    maxPlayers: Math.max(2, Math.min(8, parseInt(e.target.value) || 2))
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Numero Round (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={roomSettings.rounds}
                  onChange={(e) => setRoomSettings({
                    ...roomSettings,
                    rounds: Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Durata Round (40-90 sec)
                </label>
                <input
                  type="number"
                  min="40"
                  max="90"
                  value={roomSettings.drawTime}
                  onChange={(e) => setRoomSettings({
                    ...roomSettings,
                    drawTime: Math.max(40, Math.min(90, parseInt(e.target.value) || 40))
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Scelte Parole (2-5)
                </label>
                <input
                  type="number"
                  min="2"
                  max="5"
                  value={roomSettings.wordChoices}
                  onChange={(e) => setRoomSettings({
                    ...roomSettings,
                    wordChoices: Math.max(2, Math.min(5, parseInt(e.target.value) || 2))
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleCreateRoom}
                className="flex-1 px-6 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Crea Stanza
              </button>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-6 py-4 bg-gray-200 text-black text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Join Room */}
        {showJoinRoom && (
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Entra in una Stanza</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                ID Stanza
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Inserisci ID stanza..."
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Inserisci l'ID della stanza per entrare
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className="flex-1 px-6 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Entra
              </button>
              <button
                onClick={() => setShowJoinRoom(false)}
                className="px-6 py-4 bg-gray-200 text-black text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Instructions for local development */}
        {isDeployedWithoutServer && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-black mb-3">Come giocare in locale:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Scarica il codice sorgente del progetto</li>
              <li>Installa le dipendenze: <code className="bg-gray-200 px-2 py-1 rounded">npm install</code></li>
              <li>Avvia l'applicazione: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></li>
              <li>Apri <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:5173</code> nel browser</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};