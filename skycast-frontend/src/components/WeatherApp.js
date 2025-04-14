// WeatherApp.js — Enhanced SkyCast Engine 🌦️🌡️

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import WeatherCard from './WeatherCard';
import CityAutoSuggest from './CityAutoSuggest';
import { ThemeContext } from '../ThemeContext';

// Backgrounds
import clearImg from '../assets/weather-backgrounds/clear.jpg';
import cloudsImg from '../assets/weather-backgrounds/clouds.jpg';
import rainImg from '../assets/weather-backgrounds/rain.jpg';
import snowImg from '../assets/weather-backgrounds/snow.jpg';
import thunderstormImg from '../assets/weather-backgrounds/thunderstorm.jpg';
import mistImg from '../assets/weather-backgrounds/mist.jpg';
import hazeImg from '../assets/weather-backgrounds/haze.jpg';
import dayTheme from '../assets/theme-backgrounds/day.jpg';
import nightTheme from '../assets/theme-backgrounds/night.jpg';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('C'); // ✅ Unit state here
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('skycast_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const { theme, toggleTheme } = useContext(ThemeContext);

  const weatherBackgrounds = {
    clear: clearImg,
    clouds: cloudsImg,
    rain: rainImg,
    snow: snowImg,
    thunderstorm: thunderstormImg,
    mist: mistImg,
    haze: hazeImg
  };

  const getWeatherKey = (description) => {
    if (!description) return 'clear';
    const key = description.toLowerCase();
    if (key.includes('thunder')) return 'thunderstorm';
    if (key.includes('cloud')) return 'clouds';
    if (key.includes('rain')) return 'rain';
    if (key.includes('snow')) return 'snow';
    if (key.includes('mist')) return 'mist';
    if (key.includes('haze')) return 'haze';
    return 'clear';
  };

  const updateRecentSearches = (newCity) => {
    const updated = [newCity, ...recentSearches.filter(c => c !== newCity)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('skycast_recent', JSON.stringify(updated));
  };

  const fetchWeather = async (customCity = city) => {
    if (!customCity.trim()) {
      setError('⚠️ Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/weather?city=${customCity}`);
      setWeather(response.data);
      setError('');
      setCity(customCity);
      updateRecentSearches(customCity);
    } catch (err) {
      setError('❌ City not found or server error');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const geoRes = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
              key: process.env.REACT_APP_GEOCODE_API_KEY,
              q: `${lat},${lon}`,
              pretty: 1,
              no_annotations: 1
            }
          });

          const components = geoRes.data?.results?.[0]?.components;
          const city = components?.city || components?.town || components?.village || components?.state;

          if (!city) {
            setError('⚠️ Could not detect your city. Try again.');
            return;
          }

          await fetchWeather(city);
        } catch (err) {
          setError('❌ Failed to reverse geocode your location');
        }
      }, () => {
        setError('⚠️ Permission denied or location unavailable');
      });
    } else {
      setError('⚠️ Geolocation not supported');
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('skycast_recent');
  };

  const convertTemp = (celsius) => {
    return unit === 'F'
      ? ((celsius * 9) / 5 + 32).toFixed(1)
      : celsius.toFixed(1);
  };

  const bg = weather?.weather
    ? weatherBackgrounds[getWeatherKey(weather.weather)]
    : theme === 'light'
    ? dayTheme
    : nightTheme;

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      <div className="weather-app">
        <h1>🌦️ SkyCast</h1>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode'}
        </button>

        <CityAutoSuggest onSelectCity={(selected) => fetchWeather(selected)} />

        <button className="location-btn" onClick={fetchWeatherByLocation}>
          📍 Use My Location
        </button>

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h4>Recent Searches</h4>
            <button className="clear-history" onClick={clearRecentSearches}>
              ❌ Clear
            </button>

            <div className="recent-tags">
              {recentSearches.map((item, index) => (
                <motion.button
                  key={index}
                  className="recent-city"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => fetchWeather(item)}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">⏳ Fetching weather...</p>}
        {weather && !loading && (
          <WeatherCard
            weather={weather}
            tempUnit={unit}
            setTempUnit={setUnit}
            convertTemp={convertTemp}
          />
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
