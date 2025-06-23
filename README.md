# BlindSketch - Multiplayer Drawing Game

BlindSketch è un gioco di disegno multiplayer dove un giocatore deve disegnare una parola senza vedere quello che sta tracciando, mentre gli altri giocatori tentano di indovinare!

## 🎮 Come Funziona

1. **Blind Sketcher**: Un giocatore riceve una parola e deve disegnarla su una canvas nera (non può vedere il proprio disegno)
2. **Indovinatori**: Gli altri giocatori vedono il disegno in tempo reale e devono indovinare la parola nella chat
3. **Punteggi**: Chi indovina e chi disegna ricevono punti
4. **Vincitore**: Dopo tutti i round, vince chi ha più punti!

## 🚀 Deploy in Produzione

### 1. Deploy Backend su Render

1. Vai su [Render.com](https://render.com) e crea un account
2. Clicca "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Configura il servizio:
   - **Name**: `blindsketch-backend` (o nome a tua scelta)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`

5. Aggiungi le variabili d'ambiente:
   - `CLIENT_URL`: `https://your-netlify-app-name.netlify.app`
   - `FRONTEND_URL`: `https://your-netlify-app-name.netlify.app`
   - `NODE_ENV`: `production`

6. Clicca "Create Web Service"
7. **Copia l'URL del tuo servizio** (es: `https://blindsketch-backend.onrender.com`)

### 2. Deploy Frontend su Netlify

1. Vai su [Netlify.com](https://netlify.com) e crea un account
2. Clicca "Add new site" → "Import an existing project"
3. Connetti il tuo repository GitHub
4. Configura il build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Aggiungi le variabili d'ambiente:
   - `VITE_SERVER_URL`: `https://your-render-app-name.onrender.com` (URL del backend)

6. Clicca "Deploy site"

### 3. Aggiorna le Configurazioni

1. **Nel file `src/hooks/useSocket.ts`**, sostituisci:
   ```typescript
   serverUrl = 'https://your-render-app-name.onrender.com';
   ```
   Con l'URL effettivo del tuo backend Render.

2. **Su Render**, aggiorna le variabili d'ambiente con l'URL effettivo di Netlify.

3. **Rideploy** entrambi i servizi per applicare le modifiche.

## 🛠️ Sviluppo Locale

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

## 🔧 Risoluzione Problemi

### "Non riesco a creare/entrare in stanze"

1. **Verifica le URL**: Assicurati che le variabili d'ambiente siano configurate correttamente
2. **Controlla i CORS**: Il backend deve permettere connessioni dal frontend
3. **Verifica i log**: Controlla i log su Render per errori del server
4. **Test locale**: Prova prima in locale per verificare che tutto funzioni

### "ID stanza non viene mostrato"

1. **Controlla la connessione WebSocket**: Apri la console del browser per vedere se ci sono errori
2. **Verifica il server**: Assicurati che il backend sia online e risponda
3. **Test con curl**: Testa l'endpoint di health check: `curl https://your-backend-url/health`

### Debug Avanzato

1. **Console del browser**: Apri F12 → Console per vedere i log
2. **Network tab**: Verifica le richieste WebSocket
3. **Render logs**: Controlla i log del server su Render
4. **Netlify logs**: Verifica i log di build su Netlify

## 📝 Variabili d'Ambiente

### Frontend (.env)
```env
VITE_SERVER_URL=https://your-render-app-name.onrender.com
```

### Backend (Render Environment Variables)
```env
CLIENT_URL=https://your-netlify-app-name.netlify.app
FRONTEND_URL=https://your-netlify-app-name.netlify.app
NODE_ENV=production
PORT=3001
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

## 📞 Supporto

Per supporto o domande:
1. Controlla i log della console del browser
2. Verifica che entrambi i servizi siano online
3. Testa prima in locale per isolare il problema
4. Apri un issue nel repository GitHub

## 🤝 Contributi

I contributi sono benvenuti! Sentiti libero di aprire issue o pull request.

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT.