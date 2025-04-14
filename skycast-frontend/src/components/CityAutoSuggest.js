import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CityAutoSuggest.css';

const API_KEY = process.env.REACT_APP_GEODB_API_KEY;

function CityAutoSuggest({ onSelectCity }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.trim()) fetchSuggestions(input);
    }, 300);
    return () => clearTimeout(timeout);
  }, [input]);

  useEffect(() => {
    // Detect outside click to close dropdown
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]); // close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      const res = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
        params: { namePrefix: query, limit: 8, sort: '-population' },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      });

      const cities = res.data.data.map(c => `${c.city}, ${c.countryCode}`);
      setSuggestions(cities);
      setActiveIndex(-1);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        selectCity(suggestions[activeIndex]);
      } else {
        selectCity(input);
      }
    }
  };

  const selectCity = (city) => {
    onSelectCity(city);
    setInput(city);
    setSuggestions([]);
  };

  return (
    <div className="auto-suggest-box" ref={wrapperRef}>
      <input
        type="text"
        ref={inputRef}
        className="city-input"
        placeholder="Search for a city..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-dropdown">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => selectCity(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CityAutoSuggest;
