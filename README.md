# BetterUs Ai

A React + Vite mobile application built with Capacitor for Android and iOS deployment.

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
- **OpenAI** - AI powered coaching and analysis

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and paste your keys from Firebase Console and OpenAI:

```bash
cp .env.example .env
# fill in Firebase + OpenAI keys
```

Environment keys consumed by the app:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_OPENAI_API_KEY`

### Development

```bash
npm run dev
```

### Build (web bundle used by Capacitor)

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

### iOS Development

```bash
# Sync web assets to iOS
npx cap sync ios

# Open the workspace in Xcode for signing + simulator/device builds
npx cap open ios
```

In Xcode, set your team + bundle identifier, then archive for TestFlight/App Store.

## Production Checklist

- Enable **Email/Password** auth in Firebase console (Authentication > Sign-in method).
- Create **Firestore** database in production mode and add Firestore rules appropriate for your launch.
- Add your Firebase config values to `.env` and ensure they are bundled in CI/CD securely.
- Provide an OpenAI API key (or switch to your own backend proxy) for live AI insights.
- After running `npm run build`, always run `npx cap sync ios`/`android` before opening the native project.

## Firebase Configuration

Firebase configuration is read from environment variables in `src/firebase.js`.

## License

Private
