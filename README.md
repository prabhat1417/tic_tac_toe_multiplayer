# 🎮 Tic-Tac-Tron: Cyberpunk Tic-Tac-Toe

A real-time multiplayer Tic-Tac-Toe game with a stunning **Neon/Cyberpunk** aesthetic, powered by **Nakama** for backend matchmaking and game logic.

![Cyberpunk Theme](https://img.shields.io/badge/Theme-Cyberpunk-ff0055?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-00f3ff?style=for-the-badge&logo=react)
![Nakama](https://img.shields.io/badge/Nakama-Backend-00ff41?style=for-the-badge)

## ✨ Features

### 🎨 **Stunning UI**
- **Neon/Cyberpunk Theme** with glowing pink and green effects
- **Responsive Design** for both mobile and desktop
- **Smooth Animations** and modern glassmorphism effects
- Custom **Orbitron** font for that futuristic feel

### 🎯 **Core Gameplay**
- **Real-time Multiplayer** matches via Nakama
- **Host or Join** games with unique room codes
- **Username Persistence** - your codename stays with you
- **Turn-based Logic** with authoritative server validation

### 📊 **Advanced Stats & Leaderboard**
- Track **Wins, Losses, Draws, and Total Games Played**
- **Global Leaderboard** with detailed statistics
- **Win Percentage** calculation
- Stats persist across sessions

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (for frontend)
- **Docker** and **Docker Compose** (for Nakama backend)

### 1. Clone the Repository
```bash
git clone https://github.com/prabhat1417/tic_tac_toe_multiplayer.git
cd tic_tac_toe_nakama
```

### 2. Start the Backend (Nakama)
```bash
cd backend
docker-compose up -d
```

Wait for Nakama to fully start (check logs with `docker-compose logs -f`).

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The game will be available at `http://localhost:5173/`

## 🎮 How to Play

1. **Enter Your Codename** - Choose a unique username on the login screen
2. **Host a Game** - Create a new match and share the room code
3. **Join a Game** - Enter a friend's room code to join their match
4. **Play!** - Take turns placing X's and O's
5. **Check the Leaderboard** - See how you rank against other players

## 🏗️ Project Structure

```
tic_tac_toe_nakama/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components (Login, Game, Lobby, etc.)
│   │   ├── theme.css        # Cyberpunk theme variables
│   │   ├── nakama.js        # Nakama client setup
│   │   └── App.jsx          # Main app logic
│   └── package.json
│
└── backend/                 # Nakama server
    ├── modules/
    │   └── index.js         # Game logic & stats tracking
    └── docker-compose.yml   # Nakama configuration
```

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** 5.4.11 - Build tool
- **Nakama JS Client** 2.8.0 - Real-time multiplayer
- **CSS3** - Custom styling with CSS variables

### Backend
- **Nakama** - Open-source game server
- **JavaScript Runtime** - Server-side game logic
- **Docker** - Containerization

## 🎨 Theme Customization

The Cyberpunk theme uses CSS variables defined in `frontend/src/theme.css`:

```css
--neon-pink: #ff0055;
--neon-green: #00ff41;
--neon-blue: #00f3ff;
--bg-color: #050505;
```

Modify these to create your own color scheme!

## 📝 Game Logic

- **Authoritative Server** - All game logic runs on Nakama to prevent cheating
- **Turn Validation** - Server validates each move before updating the board
- **Win Detection** - Checks rows, columns, and diagonals after each move
- **Stats Tracking** - Automatically updates player statistics and leaderboard

## 🐛 Troubleshooting

### Frontend won't start
- Ensure you're using Node.js v18+
- Delete `node_modules` and run `npm install` again

### Backend connection issues
- Check if Nakama is running: `docker-compose ps`
- Verify Nakama is on port 7350: `http://localhost:7351` (admin console)
- Restart backend: `docker-compose restart`

### Leaderboard not updating
- Restart the Nakama backend to apply new logic
- Check backend logs: `docker-compose logs -f nakama`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- [ ] AI opponent for single-player mode
- [ ] Tournament brackets
- [ ] Custom game boards (4x4, 5x5)
- [ ] Voice chat integration
- [ ] Spectator mode
- [ ] Replay system

## 👨‍💻 Author

**Prabhat**
- GitHub: [@prabhat1417](https://github.com/prabhat1417)

---

**Enter the Matrix. Play Tic-Tac-Tron.** 🕶️✨
