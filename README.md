# Sudoku Mobile

React Native mobile app for Sudoku, built with Expo.

## Tech Stack

- React Native 0.81 + React 19
- Expo SDK 54
- Expo Router (file-based navigation)
- TanStack Query (server state)
- Zustand (client state)
- TypeScript

## Prerequisites

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator, or the Expo Go app on your phone

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

Then press `i` for iOS, `a` for Android, or scan the QR code with Expo Go.

## Running Tests

```bash
npm test
```

## Environment

The app points to the backend API. Update the API base URL in your config as needed for local vs production.
