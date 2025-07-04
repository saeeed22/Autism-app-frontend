# 🧠 Autism Detection App (React Native + Expo)

A mobile app designed to assist with early autism detection using behavioral questionnaires, motivational content, and persistent data. Built with React Native and Expo, it features a modern UI and smooth user experience with no external equipment needed.

---

## 🚀 Features

- 🔐 **Email-based OTP Registration & Login**
- 📋 **Autism screening questionnaire**
- 💬 **Inspirational quote cards** in a horizontal scroll
- ❤️ **Like & share buttons** with persistent state using `AsyncStorage`
- 🌈 **Stylized UI** with `LinearGradient` and `Ionicons`
- 🧠 **No equipment required** – relies purely on user interaction
- 🔃 **Persistent state & session handling**
- 📱 **Keyboard-aware input handling**

---

## 📦 Tech Stack & Libraries

| Feature | Library |
|--------|---------|
| UI Framework | React Native (Expo) |
| UI Enhancements | `expo-linear-gradient`, `@expo/vector-icons` |
| Data Persistence | `@react-native-async-storage/async-storage` |
| Navigation | `expo-router` (if used) |
| State Management | React `useState`, `useEffect` |
| Input Handling | `KeyboardAvoidingView`, `TextInput` |
| Loading States | `ActivityIndicator` |

---

## 📂 Project Structure

autism-app/
├── app/ # Screens and routes
├── components/ # Reusable UI components
├── tabs/ # Bottom tab navigation screens
├── assets/ # Images and fonts
├── utils/ # Helper functions
├── App.tsx # Entry point
└── README.md # This file


## 🔧 Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Git

---

### Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/saeeed22/Autism-app-frontend.git
   cd Autism-app-frontend

Install dependencies


npm install


Start the development server

npx expo start

Scan the QR code in Expo Go (mobile) or run in an emulator.

🧪 How to Use
Open the app and register using your email

Verify with OTP

Start the autism questionnaire

Browse inspirational quotes and like/share them

User state (likes, login) is saved locally using AsyncStorage

🧑‍💻 Contributing
Fork the repo

Create a branch: git checkout -b feature/YourFeature

Make your changes and commit: git commit -m 'Add feature'

Push: git push origin feature/YourFeature

Submit a pull request

📜 License
This project is open-source under the MIT License

🙋‍♂️ Author
Saeed Ahmed
GitHub: @saeeed22