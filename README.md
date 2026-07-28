# MedLocator - Frontend

React single-page application for MedLocator, a location-aware medicine availability
platform for under-resourced healthcare communities. The frontend serves two distinct
user groups through a unified design system: patients searching for medicines at nearby
clinics, and clinic staff managing inventory and hold requests.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Application Structure](#application-structure)
- [Design System](#design-system)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

The frontend is split into two portals that share one codebase, one design system,
and one palette:

**Client Portal** is a zero-authentication, mobile-first interface for patients.
A patient can search for a medicine by brand name, active ingredient, or symptom
category, view nearby clinics with color-coded stock availability, request a 2-hour
hold at a clinic, and track the status of that hold in real time. No account is
required at any point.

**Clinic Portal** is an authenticated dashboard for clinic pharmacists and
administrators. It provides real-time inventory management, a hold request inbox
that polls the backend every 30 seconds, stock alert notifications, and administrator
tools for managing staff accounts and facility settings.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| Vite | 5.4.6 | Build tool and dev server |
| React Router | 6.26.1 | Client-side routing with lazy-loaded route chunks |
| Tailwind CSS | 3.4.10 | Utility-first styling with custom design tokens |
| Firebase JS SDK | 10.13.1 | Client-side authentication |
| Axios | 1.7.7 | HTTP client with automatic token attachment |
| Leaflet + react-leaflet | 1.9.4 / 4.2.1 | Interactive map rendering via OpenStreetMap |
| Lucide React | 0.445.0 | Icon library |
| date-fns | 3.6.0 | Countdown timer formatting |

---

## Project Structure

```
medlocator-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── src/
    ├── main.jsx                        # Application entry point
    ├── App.jsx                         # Root component and route definitions
    ├── api/
    │   ├── firebase.js                 # Firebase SDK initialization
    │   ├── axiosClient.js              # Axios instance with token interceptors
    │   ├── authApi.js                  # Firebase login + Django profile fetch
    │   ├── searchApi.js                # Public search endpoints
    │   ├── holdRequestApi.js           # Client and clinic hold request endpoints
    │   ├── inventoryApi.js             # Inventory CRUD
    │   ├── alertsApi.js                # Stock alert endpoints
    │   ├── staffApi.js                 # Staff management endpoints
    │   └── clinicApi.js                # Clinic profile endpoints
    ├── context/
    │   ├── AuthContext.jsx             # Firebase session + Django staff profile
    │   ├── GeolocationContext.jsx      # HTML5 Geolocation API wrapper
    │   ├── SearchContext.jsx           # Search query and results state
    │   └── ToastContext.jsx            # Global toast notification system
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useGeolocation.js
    │   ├── useSearch.js
    │   ├── useToast.js
    │   ├── useDebounce.js              # Debounces search input keystrokes
    │   └── usePolling.js               # Generic interval-polling hook
    ├── components/
    │   ├── ui/                         # Reusable design system primitives
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx               # Bottom sheet (mobile) and centered (desktop)
    │   │   ├── StatusChip.jsx          # Traffic light chip (Available/Low/Out)
    │   │   ├── ProgressBar.jsx
    │   │   ├── Toggle.jsx              # Out-of-stock override switch
    │   │   ├── Badge.jsx               # Notification count badge
    │   │   ├── Avatar.jsx
    │   │   └── Spinner.jsx
    │   ├── layout/
    │   │   ├── ClientLayout.jsx        # Mobile shell: top nav and bottom nav
    │   │   ├── ClinicLayout.jsx        # Desktop shell: sidebar and main content
    │   │   ├── BottomNav.jsx
    │   │   ├── Sidebar.jsx             # Clinic sidebar with live hold and alert counts
    │   │   └── ProtectedRoute.jsx      # Redirects unauthenticated users to /login
    │   ├── map/
    │   │   └── MapContainer.jsx        # Leaflet wrapper with custom status-colored pins
    │   └── search/
    │       ├── SearchBar.jsx
    │       ├── SuggestionChips.jsx
    │       └── ClinicResultCard.jsx    # Reused across search, substitutes, and denied screens
    ├── features/
    │   ├── client-portal/
    │   │   ├── SearchPage.jsx          # Landing screen: search, map thumbnail, results
    │   │   ├── MapPage.jsx             # Full-screen map with draggable results drawer
    │   │   ├── HoldRequestSheet.jsx    # Bottom sheet: phone number collection
    │   │   ├── HoldPendingPage.jsx     # Countdown timer + denied state
    │   │   └── SubstitutePage.jsx      # Smart substitute results
    │   ├── clinic-auth/
    │   │   └── LoginPage.jsx           # Firebase email/password login
    │   ├── clinic-dashboard/
    │   │   ├── DashboardPage.jsx       # Summary stats and hold request inbox
    │   │   ├── InventoryPage.jsx       # Inventory table with quick-toggle controls
    │   │   ├── HoldRequestsPage.jsx    # Full hold requests inbox with filter tabs
    │   │   ├── StockAlertsPage.jsx     # Alert list with resolve action
    │   │   ├── HoldRequestsInboxPanel.jsx
    │   │   └── components/
    │   │       ├── InventoryRow.jsx
    │   │       ├── HoldRequestCard.jsx
    │   │       └── AddMedicineModal.jsx
    │   └── clinic-settings/
    │       ├── SettingsPage.jsx
    │       ├── AddStaffModal.jsx
    │       └── components/
    │           ├── FacilityProfileCard.jsx
    │           ├── StaffAccountsCard.jsx
    │           └── ThresholdsCard.jsx
    ├── utils/
    │   ├── constants.js                # Enums mirroring backend model choices
    │   ├── formatters.js               # Countdown, distance, time ago, phone masking
    │   └── validators.js               # Phone (E.164) and password strength checks
    └── styles/
        └── index.css                   # Tailwind directives and global resets
```

---

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- The MedLocator backend running locally or deployed (see the backend README)
- A Firebase project with Email/Password authentication enabled

---

## Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/medlocator-frontend.git
cd medlocator-frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in all required values. See the Environment Variables section
below for details on where to find each value.

**4. Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

Before the login page will work, you must have:
- The Django backend running at the URL specified in `VITE_API_BASE_URL`
- At least one clinic created via the Django admin or API
- At least one staff account provisioned via the backend's staff creation endpoint,
  which creates the Firebase user and Django profile together

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the following. All variables must be
prefixed with `VITE_` to be accessible in the browser bundle.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Django backend API, e.g. `http://localhost:8000/api/v1` |
| `VITE_FIREBASE_API_KEY` | Firebase web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain, e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

All Firebase values are found in the Firebase Console under Project Settings > Your apps
> Web app > SDK setup and configuration. Select the "Config" option to see the
`firebaseConfig` object with all required fields.

---

## Firebase Setup

The frontend uses the Firebase JS SDK to authenticate clinic staff. Authentication
happens entirely client-side: the user enters their email and password, Firebase
validates the credentials and returns an ID token, and that token is then sent with
every API request to the Django backend for server-side verification.

**1. Add a web app to your Firebase project**

In the Firebase Console, go to Project Settings > Your apps and click "Add app".
Select the web platform. Copy the configuration values into your `.env` file.

**2. Enable Email/Password sign-in**

In the Firebase Console, go to Authentication > Sign-in method and enable the
Email/Password provider.

**3. Create the first staff account**

Staff accounts cannot be self-registered. They must be provisioned through the backend
API by a superuser or clinic administrator. Use the Postman collection provided with
the backend to call `POST /api/v1/clinics/{clinic_id}/staff/`. This creates the
Firebase user and the corresponding Django profile in one operation. The staff member
can then log in using the credentials set during provisioning.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server at `http://localhost:5173` |
| `npm run build` | Build the production bundle to the `dist/` directory |
| `npm run preview` | Preview the production build locally |

---

## Application Structure

**Routing**

Routes are defined in `src/App.jsx`. The application has two route groups:

Client Portal routes (`/`, `/map`, `/substitutes`, `/hold/new`, `/hold/:requestId`)
are wrapped in `ClientLayout` and require no authentication. They are accessible to
any visitor.

Clinic Portal routes (`/dashboard`, `/dashboard/inventory`, `/dashboard/holds`,
`/dashboard/alerts`, `/dashboard/settings`) are wrapped in `ProtectedRoute`, which
checks for an active Firebase session and a valid Django staff profile. Unauthenticated
users are redirected to `/login`.

**Code splitting**

Every route-level component is loaded with `React.lazy()` and wrapped in `Suspense`.
Vite's `manualChunks` configuration further separates React, the map library, and
Firebase into their own chunks so patients loading the search page do not download
clinic dashboard code or the Firebase SDK.

**State management**

Global state is managed through four React contexts:

- `AuthContext` listens to Firebase's `onAuthStateChanged` and fetches the Django
  staff profile on session restore, so a page refresh does not log the user out
- `GeolocationContext` wraps the HTML5 Geolocation API and provides a Kigali
  city-centre fallback coordinate when permission is denied
- `SearchContext` holds the current search query, results, and matched ingredient
  across route navigations so results persist when the user opens a hold sheet
  and returns to the search page
- `ToastContext` provides a `showToast` function available throughout the app

**Polling**

The `usePolling` hook in `src/hooks/usePolling.js` implements the 30-second polling
pattern used by the clinic dashboard hold request inbox and the client-side hold status
tracker. It accepts a fetch function, an interval in milliseconds, and a dependency
array, and re-runs the fetch whenever the dependencies change.

---

## Design System

The design system is defined entirely in `tailwind.config.js` as custom tokens.
Every color, shadow, border radius, and font stack used in the application maps to
a named token rather than a raw value.

**Palette**

| Token | Hex | Role |
|---|---|---|
| `cream` | `#FDF0D5` | Page background on every screen |
| `sage` | `#586F6B` | Sidebar, primary buttons, progress bars, active states |
| `sage-tint` | `#E8F0EF` | Chip backgrounds, input focus rings |
| `rose` | `#A07178` | Wordmark, hold action links, notification badges |
| `rose-tint` | `#F5E8EA` | Suggestion chips, location pill |
| `status-available` | `#22C55E` | Traffic light: In Stock |
| `status-low` | `#F59E0B` | Traffic light: Low Stock |
| `status-out` | `#EF4444` | Traffic light: Out of Stock and destructive actions |
| `border` | `#E2DBD6` | All borders and dividers |
| `muted` | `#9CA9A7` | Secondary text and disabled icons |

**Typography**

DM Sans is used for all UI text. DM Mono is used exclusively for numerical data:
inventory unit counts, hold request countdown timers, and GPS coordinates. Both
fonts are loaded from Google Fonts via the HTML entry point.

**Traffic light chips**

The `StatusChip` component is the most critical UI element in the application. It
always displays both a colored dot and a text label. It never shows a raw inventory
number. The three states (Available, Low Stock, Out of Stock) are the only stock
signals ever shown to patients, as required by the system specification.

---

## Authentication Flow

1. The staff member enters their email and password on the login page.
2. The frontend calls `signInWithEmailAndPassword` from the Firebase JS SDK.
3. Firebase validates the credentials and returns an ID token.
4. The frontend immediately calls `GET /api/v1/auth/me/` with the token in the
   `Authorization: Bearer` header.
5. The Django backend verifies the token, looks up the `ClinicStaff` record by
   `firebase_uid`, and returns the staff profile including role and clinic details.
6. `AuthContext` stores the profile in state and the user is redirected to
   `/dashboard`.
7. On every subsequent API request, `axiosClient.js` calls `user.getIdToken()` to
   get a fresh token, which Firebase returns from cache unless it has expired, in
   which case it refreshes automatically.
8. On page refresh, `onAuthStateChanged` fires and the profile is re-fetched from
   the backend, restoring the session without requiring a new login.

---

## API Integration

All network calls go through `src/api/axiosClient.js`, which is a configured Axios
instance that automatically attaches the Firebase ID token to every outgoing request.
Individual API modules (`searchApi.js`, `holdRequestApi.js`, etc.) import this client
and export plain async functions that components and contexts call directly.

No component ever imports Axios or constructs a URL manually. This means the API
base URL, authentication headers, and error retry logic are all managed in one place.
Switching the backend URL from localhost to a deployed domain requires changing one
line in `.env`.

**Error handling**

API errors are surfaced to the user through the toast system. Each feature component
catches errors from its API calls and calls `showToast` with the message returned
by the backend's standard error envelope (`error.response.data.error.message`).

---

## Deployment

The frontend is a static single-page application and can be deployed to any static
hosting service. Vercel and Netlify both support it with zero configuration.

**Build the production bundle**

```bash
npm run build
```

The output is written to the `dist/` directory.

**Vercel**

Connect the repository to Vercel. Set the build command to `npm run build` and the
output directory to `dist`. Add all environment variables from your `.env` file in
the Vercel project settings under Environment Variables.


**Important:** Because this is a single-page application using client-side routing,
you must configure your hosting provider to redirect all requests to `index.html`.
On Netlify, create a `_redirects` file in the `public/` directory with the content:

```
/*    /index.html    200
```

On Vercel, this is handled automatically.

---

## Known Limitations

**Leaflet marker icons in production**

Leaflet's default marker icons use relative image paths that break under Vite's
production build. The `MapContainer.jsx` component addresses this by overriding
`L.Icon.Default` with explicit URLs pointing to the Leaflet CDN. If map markers
appear without their icon image, verify that the CDN URLs in `MapContainer.jsx`
are reachable in your deployment environment.

**Polling latency**

The clinic hold request inbox and the client hold status tracker both update by
polling the backend every 30 seconds. There is an inherent latency of up to 30
seconds between a pharmacist approving a hold and the patient seeing the updated
status. This is a deliberate architectural constraint driven by the zero-infrastructure-
cost requirement, not a bug. A real-time implementation would require WebSockets
or server-sent events, which add infrastructure cost.

**Geolocation on HTTP**

The HTML5 Geolocation API is restricted to secure contexts (HTTPS) in most browsers.
During local development over HTTP, geolocation will be denied, and the application
will fall back to Kigali city centre coordinates. This does not affect production
deployments served over HTTPS.
