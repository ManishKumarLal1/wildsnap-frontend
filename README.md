# 🦋 WildSnap

> **Explore. Capture. Discover.**

WildSnap is a wildlife exploration mobile application built with **React Native and Expo**. It turns wildlife observation into an interactive experience where users can photograph species, identify them using AI, earn XP, build their collection, and compete on leaderboards.

The goal is to encourage people to explore and learn about wildlife while making species discovery engaging and rewarding.

---

## ✨ Features

### 📸 Wildlife Observation

* Capture wildlife photographs directly from the app.
* Review photographs before submitting an observation.
* Upload observation images to the backend.
* Track previously submitted observations.

### 🤖 AI-Powered Species Identification

WildSnap uses AI to analyze wildlife photographs and identify the observed species.

The analysis provides:

* Species name
* Scientific name
* Confidence score
* Species category
* Rarity
* XP reward

### 🛡️ Image Verification

WildSnap includes a second-stage verification process designed to detect potentially invalid observations, including:

* AI-generated images
* Copied/reused images
* Potentially invalid wildlife observations

This helps maintain the integrity of the wildlife collection and leaderboard.

### 🦚 Species Collection

Users can build their personal wildlife collection by discovering different species.

Each species can contain:

* Common name
* Scientific name
* Category
* Rarity
* XP
* Discovery information

### 🏆 XP & Progression

Users earn XP from wildlife discoveries.

The app includes:

* XP progression
* Levels
* Rarity-based rewards
* First-discovery rewards
* Observation history

### 🔥 Daily Streak

Users can maintain a daily exploration streak by making observations.

### 🌎 Leaderboards

WildSnap supports competitive progression through leaderboards, including:

* Global rankings
* Local rankings
* XP-based progression

### 👤 User Profiles

Profiles provide an overview of the user's wildlife exploration progress, including:

* Username
* Level
* XP
* Species discovered
* Observation count
* Current streak

---

## 🛠️ Tech Stack

### Frontend

* **React Native**
* **Expo**
* **Expo Router**
* **TypeScript**
* **Zustand**
* **Axios**
* **Expo Camera**
* **Expo Image Picker**
* **Ionicons**
* **Tailwind / Native styling**

### Backend

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT Authentication**
* **bcrypt**
* **Cloudinary**
* **Groq API**
* **Resend**

### Infrastructure

* **GitHub** — Source control
* **Render** — Backend hosting
* **Aiven** — PostgreSQL database
* **Cloudinary** — Image storage

---

## 📱 Application Flow

```text
User
 │
 ▼
Camera
 │
 ▼
Review Observation
 │
 ▼
Upload Image
 │
 ▼
AI Species Identification
 │
 ├── Species
 ├── Scientific Name
 ├── Confidence
 ├── Rarity
 └── XP
 │
 ▼
Image Verification
 │
 ▼
Observation Result
 │
 ├── Collection
 ├── XP / Level
 ├── Streak
 └── Leaderboard
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* Expo CLI / Expo development environment
* Android Studio if using an Android emulator

---

### 1. Clone the repository

```bash
git clone https://github.com/ManishKumarLal1/wildsnap-frontend.git
```

Then:

```bash
cd wildsnap-frontend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
```

Replace the URL with the deployed WildSnap backend URL.

> **Important:** Never commit `.env` to GitHub. A `.env.example` file can be used as a template.

---

### 4. Start the Expo development server

```bash
npx expo start
```

You can then open the application using:

* Android emulator
* Physical Android device
* Expo development build

---

## 📂 Project Structure

```text
wildsnap-frontend/
│
├── app/
│   ├── (auth)/
│   ├── (tabs)/
│   ├── observation/
│   └── species/
│
├── assets/
│   └── images/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── screens/
│   ├── store/
│   ├── theme/
│   ├── types/
│   └── utils/
│
├── .env.example
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication

WildSnap uses token-based authentication.

The authentication system supports:

* User registration
* Login
* JWT authentication
* Password reset
* Protected API requests
* Persistent authentication state

---

## 🌐 Backend

The WildSnap frontend communicates with a separate backend API.

Backend repository:

**WildSnap Backend**

https://github.com/ManishKumarLal1/wildsnap-backend

The backend is responsible for:

* Authentication
* User management
* Species data
* Observation management
* Image uploads
* AI analysis
* Image verification
* XP and progression
* PostgreSQL database operations

---

## 🗄️ Database

WildSnap uses **PostgreSQL** for persistent application data.

The database contains information related to:

* Users
* Species
* User species collections
* Observations
* Image metadata
* Discovery information

---

## ☁️ Image Storage

Wildlife observation images are stored using **Cloudinary**.

The application stores Cloudinary information alongside observation records so uploaded images can be retrieved and managed through the backend.

---

## 🧠 AI Processing

WildSnap uses a two-stage approach for wildlife observations:

### Stage 1 — Species Identification

The uploaded image is analyzed to determine:

```text
Species
Scientific Name
Category
Confidence
Rarity
XP
```

### Stage 2 — Image Verification

The observation image is additionally checked for potential:

```text
AI-generated content
Copied/reused images
Invalid observations
```

The verification stage is intended to improve the quality and reliability of observations submitted to the platform.

---

## 🎮 Progression System

WildSnap uses XP and rarity to make species discovery more engaging.

Species can have one of the following rarity levels:

```text
Common
Uncommon
Rare
Epic
Legendary
```

Discoveries contribute XP toward the user's level.

---

## 🧪 Development

Run the development server with:

```bash
npx expo start
```

For Android:

```bash
npx expo start --android
```

Clear the Expo cache if necessary:

```bash
npx expo start -c
```

---

## 📦 Building the App

For an Android build using EAS:

```bash
eas build --platform android
```

For a preview build:

```bash
eas build --platform android --profile preview
```

---

## 🔒 Security

Do not commit sensitive credentials to GitHub.

Never commit:

```text
.env
API keys
JWT secrets
Cloudinary secrets
Database passwords
Service account credentials
```

The frontend should only contain public configuration such as:

```env
EXPO_PUBLIC_API_URL=...
```

Backend secrets must remain configured through the hosting provider's environment variables.

---

## 🗺️ Roadmap

Future improvements may include:

* [ ] Improved wildlife species recognition
* [ ] Stronger image verification
* [ ] Wildlife habitat information
* [ ] Location-based discoveries
* [ ] Local wildlife challenges
* [ ] Advanced leaderboards
* [ ] Achievement system
* [ ] More detailed species profiles
* [ ] Offline observation support
* [ ] Push notifications
* [ ] Production Android release
* [ ] iOS release

---

## 👨‍💻 Author

**Manish Kumar Lal**

B.Tech — Computer Science & Engineering

GitHub:
https://github.com/ManishKumarLal1

---

## 📄 License

This project is currently under development.

License information will be added when the project is prepared for public distribution.

---

⭐ If you find WildSnap interesting, consider starring the repository and following the project as it develops.

## 📱 Download APK

You can download and install the latest Android APK from Expo:

**[Download WildSnap APK] https://expo.dev/accounts/manishkrlal/projects/frontend/builds/6b13289e-2c26-4d35-a5b9-985e1fcfd3a9**

> Download the APK on an Android device and install it to try WildSnap.
