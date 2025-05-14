# LeetCoders Frontend

The frontend application for LeetCoders platform, built with React, Vite, Tailwind, Material-UI, and Framer Motion providing an intuitive and engaging user interface for the community.

## 🏗️ Architecture

The frontend follows a modern React architecture with Vite as the build tool.

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── challenges/ # Challenge-related components
│   ├── pages/          # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── SignIn.jsx          # Authentication page
│   │   ├── ProfilePage.jsx     # User profile
│   │   ├── UserPage.jsx        # User details
│   │   ├── ChallengesPage.jsx  # Coding challenges
│   │   ├── DailyChallengePage.jsx # Daily coding challenges
│   │   ├── ChatPage.jsx        # Messaging functionality
│   │   ├── GoalPage.jsx        # Goals tracking
│   │   ├── GoalForm.jsx        # Goal creation
│   │   ├── LeaderBoardPage.jsx # Community rankings
│   │   ├── StriverSheet.jsx    # DSA sheet tracker
│   │   └── NotFound.jsx        # 404 page
│   ├── utils/          # Utility functions
│   │   └── Analytics.jsx # Analytics integration
│   ├── assets/         # Static assets
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   ├── App.css         # Global styles
│   └── index.css       # Base styles
├── public/             # Public assets
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

### UI Features
- Responsive design with Tailwind CSS
- Real-time updates with Socket.IO
- Interactive charts with Chart.js
- Smooth animations with Framer Motion
- Material UI components

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
VITE_API_CHAT_URL=http://localhost:5001
```

3. Start the development server:
```bash
npm run dev
```

For production build:
```bash
npm run build
```

## 🎨 UI Components

### Layout
- Navbar - Site navigation (Navbar.jsx, UserNavbar.jsx)
- Footer - Site footer (Footer.jsx)
- Hero Section - Landing page introduction (HeroSection.jsx)
- About Section - Platform information (AboutSection.jsx)
- Feature Section - Platform features (FeatureSection.jsx)

### Functional Components
- Goal Card - Goal visualization (GoalCard.jsx)
- Challenge Components - Manage challenges (ActiveChallenges.jsx, ChallengeHistory.jsx)
- Friend Management - Social features (FriendSearch.jsx, SearchUser.jsx)
- Authentication - User login/signup (SignIn.jsx)
- Leaderboard - Rankings display (LeaderboardPreview.jsx)


## 🤝 Contributing

Please read our [Contributing Guidelines](../../CONTRIBUTING.md) before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
