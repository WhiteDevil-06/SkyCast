// WeatherCard.js — Weather Display + Clock + Unit Toggle ⛅🌡️
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import LiveClock from './LiveClock';
import './WeatherCard.css';

function WeatherCard({ weather, tempUnit, setTempUnit, convertTemp }) {
  const {
    city,
    country,
    temp,
    weather: description,
    humidity,
    windSpeed,
    icon,
    coord
  } = weather;

  const lat = coord?.lat;
  const lon = coord?.lon;

  return (
    <div className="weather-card">
      <h2 className="city-typewriter">
        📍{' '}
        <Typewriter
          key={`${city}-${country}`}
          words={[`${city}, ${country}`]}
          loop={1}
          cursor
          cursorStyle="|"
          typeSpeed={80}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h2>

      {lat && lon ? (
        <LiveClock lat={lat} lon={lon} />
      ) : (
        <p>🕒 Time not available (missing coordinates)</p>
      )}

      <p>
        {convertTemp(temp)}°{tempUnit} — {description}
      </p>

      <div className="unit-toggle">
        <span
          className={tempUnit === 'C' ? 'active' : ''}
          onClick={() => setTempUnit('C')}
        >
          °C
        </span>
        <span>|</span>
        <span
          className={tempUnit === 'F' ? 'active' : ''}
          onClick={() => setTempUnit('F')}
        >
          °F
        </span>
      </div>

      <p>💧 Humidity: {humidity}%</p>
      <p>💨 Wind: {windSpeed} m/s</p>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="Weather icon"
      />
    </div>
  );
}

export default WeatherCard;
