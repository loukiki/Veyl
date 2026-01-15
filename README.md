# my_little_larper (Veyl)

This is a **Create React App** project for **Veyl**: an accountability-partner app using **Firebase Auth** + **Firestore**.

## Run it locally

From the project folder:

```bash
cd /home/kyo/Projects/my_little_larper
npm install
npm start
```

Then open the URL printed by the dev server (usually `http://localhost:3000`).

## Refactor Overview

The original `src/App.js` (~1k lines) was split into smaller, focused files.
Behavior and UI are unchanged; this is a structure/maintainability refactor.

### Core App Flow

- `src/App.js` — top-level app routing, auth state, and waiting-page polling.
- `src/firebase.js` — Firebase initialization, exports `auth` + `db`.
- `src/services/matching.js` — matchmaking query + user updates.

### UI Components

- `src/components/AuthPage.js` — login/signup UI and user creation.
- `src/components/OnboardingPage.js` — 3-step onboarding flow.
- `src/components/WaitingPage.js` — “finding match” UI + manual check.
- `src/components/DashboardPage.js` — tabbed dashboard + sign out.
- `src/components/OverviewView.js` — goal + partner summary.
- `src/components/ChatView.js` — realtime chat, message limits.
- `src/components/CheckinView.js` — daily/weekly check-ins + history.

## Notes (Firebase)

- The Firebase config is currently hard-coded in `src/firebase.js`.
- For full functionality, the Firebase project needs:
  - Email/Password auth enabled
  - Firestore enabled (collections used include `users`, `chats/*/messages`, `checkins`, `notifications`)

