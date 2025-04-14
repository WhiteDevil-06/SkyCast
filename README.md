# 🌤️ SkyCast - Next-Gen Weather Web App

SkyCast is a futuristic, full-stack weather application that combines real-time weather updates, geolocation intelligence, auto-suggest search, and time-zone-aware clocks — all wrapped in a **glassmorphic UI** with beautiful day/night theming and smooth animations.

---

### ⚡ Features

- 🔍 **Smart AutoSuggest** – Search for any city across the globe
- 📍 **Use My Location** – Fetch weather using device GPS
- ⏰ **Live Clock** – Time synced with city’s timezone
- 🌡️ **°C / °F Toggle** – Seamless unit conversion
- 🎨 **Dynamic Backgrounds** – Changes with weather + day/night
- 🌓 **Theme Switcher** – Toggle light/dark mode manually
- 🧠 **Recent Searches** – Auto-saved (with localStorage)
- ⚙️ **Responsive Design** – Works across all devices
- ✨ **Framer Motion Animations**

---

### 🛠️ Tech Stack

**Frontend**:
- React
- Axios
- Framer Motion
- Typewriter
- OpenWeatherMap API
- GeoDB Cities API
- OpenCage Geocoder API
- TimeZoneDB API

**Backend**:
- Node.js + Express
- Custom weather API proxy

---

### 🚀 How to Run (Dev Mode)

```bash
# Clone repo
git clone https://github.com/WhiteDevil-06/SkyCast.git
cd SkyCast

# Frontend setup
cd skycast-frontend
npm install
npm start

# Backend setup (in another terminal)
cd ../skycast-backend
npm install
node index.js
