// LiveClock.js — City-Based Real-Time Clock ⏰

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LiveClock.css';

function LiveClock({ lat, lon }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [is24Hour, setIs24Hour] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.REACT_APP_TIMEZONEDB_API_KEY;

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchTimeZone = async () => {
      try {
        const response = await axios.get(`https://api.timezonedb.com/v2.1/get-time-zone`, {
          params: {
            key: apiKey,
            format: 'json',
            by: 'position',
            lat,
            lng: lon,
          },
        });

        if (response.data.status === 'OK') {
          setTimezone(response.data.zoneName);
        } else {
          console.warn("⚠️ TimezoneDB error:", response.data.message);
        }
      } catch (error) {
        console.error('❌ Error fetching timezone:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeZone();
  }, [lat, lon, apiKey]);

  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const now = new Date();
      const timeOptions = {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: !is24Hour,
      };
      const dateOptions = {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      setTime(new Intl.DateTimeFormat('en-US', timeOptions).format(now));
      setDate(new Intl.DateTimeFormat('en-US', dateOptions).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone, is24Hour]);

  if (loading) return <p className="live-clock">Loading time...</p>;
  if (!timezone) return <p className="live-clock">Timezone not found</p>;

  return (
    <div className="live-clock">
      <p className="time">{time}</p>
      <p className="date">{date}</p>
      <button onClick={() => setIs24Hour(prev => !prev)} className="toggle-format">
        {is24Hour ? 'Switch to 12h' : 'Switch to 24h'}
      </button>
    </div>
  );
}

export default LiveClock;
