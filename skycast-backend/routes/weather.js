// routes/weather.js - Weather API Logic

const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;

// ✅ Build OpenWeatherMap API URL dynamically
const buildUrl = (params, unit = 'metric') => {
  const base = 'https://api.openweathermap.org/data/2.5/weather';
  return `${base}?${params}&appid=${API_KEY}&units=${unit}`;
};

// ✅ Format extracted weather data
const extractData = (data) => ({
  city: data.name,
  country: data.sys.country,
  temp: data.main.temp,
  weather: data.weather[0].description,
  icon: data.weather[0].icon,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  coord: data.coord,
});

// 🌍 GET Weather by city name or geolocation (lat/lon)
router.get('/', async (req, res) => {
  const { city, lat, lon, unit = 'metric' } = req.query; // ✅ Include unit from query (default to Celsius)

  try {
    let url;

    if (city) {
      url = buildUrl(`q=${encodeURIComponent(city)}`, unit);
    } else if (lat && lon) {
      url = buildUrl(`lat=${lat}&lon=${lon}`, unit);
    } else {
      return res.status(400).json({ error: '⚠️ Missing city or coordinates' });
    }

    const response = await axios.get(url);
    const weatherData = extractData(response.data);

    console.log('🌦️ Weather API Response Sent:', weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('❌ Error fetching weather:', error.message);
    res.status(500).json({ error: '🚫 Failed to fetch weather data' });
  }
});

module.exports = router;
