# BlindSketch - Multiplayer Drawing Game

BlindSketch è un gioco di disegno multiplayer dove un giocatore deve disegnare una parola senza vedere quello che sta tracciando, mentre gli altri giocatori tentano di indovinare!

## 🎮 Come Funziona

1. **Blind Sketcher**: Un giocatore riceve una parola e deve disegnarla su una canvas nera (non può vedere il proprio disegno)
2. **Indovinatori**: Gli altri giocatori vedono il disegno in tempo reale e devono indovinare la parola nella chat
3. **Punteggi**: Chi indovina e chi disegna ricevono punti
4. **Vincitore**: Dopo tutti i round, vince chi ha più punti!

## 🚀 Installazione e Avvio

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione
```bash
# Clona il repository
git clone <repository-url>
cd blindsketch-multiplayer

# Installa le dipendenze
npm install
```

### Avvio dell'Applicazione
```bash
# Avvia sia il server che il client
npm run dev
```

Questo comando avvierà:
- **Server backend** su `http://localhost:3001`
- **Client frontend** su `http://localhost:5173`

### Comandi Separati
```bash
# Solo server
npm run server

# Solo client
npm run client

# Build per produzione
npm run build
```

## 🎯 Funzionalità

### Modalità di Gioco
- **Stanze Private**: Crea una stanza con impostazioni personalizzate
- **Stanze Casuali**: Entra in una stanza esistente con un ID

### Impostazioni Personalizzabili
- Numero massimo di giocatori (2-8)
- Numero di round (1-10)
- Durata di ogni round (40-90 secondi)
- Numero di parole tra cui scegliere (2-5)
- Numero di indizi lettera durante il round

### Caratteristiche del Gioco
- **Canvas Cieca**: Il disegnatore non vede quello che sta disegnando
- **Chat in Tempo Reale**: Per indovinare le parole
- **Sistema di Punteggi**: Punti per chi indovina e chi disegna
- **Indizi Lettera**: Lettere rivelate progressivamente
- **Interfaccia Responsive**: Ottimizzata per desktop

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** per lo styling
- **Lucide React** per le icone
- **Socket.IO Client** per la comunicazione real-time

### Backend
- **Node.js** con Express
- **Socket.IO** per WebSocket
- **UUID** per generazione ID stanze

## 📁 Struttura del Progetto

```
blindsketch-multiplayer/
├── src/
│   ├── components/          # Componenti React
│   │   ├── HomeScreen.tsx   # Schermata iniziale
│   │   ├── LobbyScreen.tsx  # Lobby di attesa
│   │   ├── GameScreen.tsx   # Schermata di gioco
│   │   ├── DrawingCanvas.tsx # Canvas per disegnare
│   │   ├── Chat.tsx         # Chat component
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   └── useSocket.ts     # Hook per Socket.IO
│   ├── types/               # Definizioni TypeScript
│   │   └── game.ts          # Tipi del gioco
│   └── App.tsx              # Componente principale
├── server/
│   └── index.js             # Server backend
└── package.json
```

## 🎨 Design e UI

### Palette Colori
- **Bianco**: `#FFFFFF` (background principale)
- **Nero**: `#000000` (testi e icone)
- **Arancione**: `#FFA500` (accenti e bottoni)

### Caratteristiche UI
- Design minimalista e moderno
- Transizioni fluide
- Responsive design
- Feedback visivo per le interazioni

## 🔧 Configurazione Avanzata

### Variabili d'Ambiente
Crea un file `.env` per configurazioni personalizzate:

```env
VITE_SERVER_URL=http://localhost:3001
PORT=3001
```

### Deploy in Produzione

#### Frontend (Netlify/Vercel)
```bash
npm run build
# Carica la cartella dist/
```

#### Backend (Heroku/Railway/DigitalOcean)
Il server deve essere deployato separatamente su una piattaforma che supporta Node.js e WebSocket.

## 🐛 Risoluzione Problemi

### Problemi Comuni

1. **"Non connesso al server"**
   - Assicurati che il server sia in esecuzione su porta 3001
   - Controlla che non ci siano firewall che bloccano la connessione

2. **"Impossibile creare/entrare in stanza"**
   - Verifica la connessione WebSocket
   - Riavvia il server se necessario

3. **Canvas non funziona**
   - Assicurati di essere in modalità desktop
   - Controlla la console per errori JavaScript

### Debug
Apri la console del browser (F12) per vedere i log di connessione e eventuali errori.

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 🤝 Contributi

I contributi sono benvenuti! Sentiti libero di aprire issue o pull request.

## 📞 Supporto

Per supporto o domande, apri un issue nel repository GitHub.