# BetterUs Ai

A React + Vite mobile application built with Capacitor for Android deployment.

## Package ID
`com.betterusai.app`

## Tech Stack

- **React** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Firebase** - Backend (Auth & Firestore)
- **Capacitor** - Cross-platform native runtime
- **Recharts** - Charts library
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Android Development

```bash
# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

## Firebase Configuration

Before running the app, update the Firebase configuration in `src/firebase.js` with your own keys from the Firebase Console.

## License

Private
