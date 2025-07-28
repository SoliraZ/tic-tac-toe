# Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with React, TypeScript, and Framer Motion. Features beautiful animations, score tracking, and a responsive design.

## 🎮 Features

- **Interactive Gameplay**: Classic Tic Tac Toe with smooth animations
- **Score Tracking**: Keep track of wins for X, O, and draws
- **Visual Feedback**: Winning combinations are highlighted with a red glow effect
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Clean, modern interface with gradient backgrounds
- **Animations**: Smooth transitions and hover effects using Framer Motion
- **Confetti Celebration**: Confetti animation when a player wins

### 🚧 Upcoming Features

- **Bot Mode**: Play against an AI opponent with different difficulty levels

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **Next.js 14** - React framework with App Router
- **Framer Motion** - Animation library for smooth transitions
- **CSS Modules** - Scoped styling for better maintainability
- **React Confetti** - Celebration effects

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tic-tac-toe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## 🎯 How to Play

1. **Start a Game**: The game begins with Player X
2. **Take Turns**: Click on any empty cell to place your mark (X or O)
3. **Win Conditions**: Get three of your marks in a row (horizontally, vertically, or diagonally)
4. **New Game**: Click "New Game" to start a fresh round
5. **Reset Scores**: Click "Reset Scores" to clear all statistics

## 📁 Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main game component
│   │   ├── tictactoe.module.css  # Game styles
│   │   └── layout.tsx        # App layout
│   └── ...
└── package.json
```

## 🎨 Key Components

- **Game Board**: 3x3 grid with interactive cells
- **Score Display**: Shows wins for X, O, and draws
- **Status Indicator**: Shows current player's turn or game result
- **Action Buttons**: New Game and Reset Scores functionality

## 🔧 Customization

The game is easily customizable through the CSS module file (`tictactoe.module.css`). You can modify:
- Colors and themes
- Animations and transitions
- Layout and spacing
- Typography and fonts

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🎉 Features in Detail

### Animations
- Smooth cell hover effects
- Winning combination highlighting
- Confetti celebration on win
- Smooth transitions between game states

### State Management
- Game board state
- Current player tracking
- Score management
- Game status (playing/won/draw)

### Accessibility
- Keyboard navigation support
- Clear visual indicators
- Disabled states for completed games

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Adding new animations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy playing Tic Tac Toe! 🎮