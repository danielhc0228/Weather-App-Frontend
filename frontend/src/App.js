import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ColorThief from "colorthief";
import "./App.css";

function App() {
    const [city, setCity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [bannerColor, setBannerColor] = useState(null);
    const bannerRef = useRef();

    const getWeather = useCallback(async () => {
        try {
            let response;
            if (city) {
                response = await axios.get(
                    `http://localhost:3000/weather?city=${city}`
                );
            } else if (latitude && longitude) {
                response = await axios.get(
                    `http://localhost:3000/weather?lat=${latitude}&lon=${longitude}`
                );
            } else {
                setError("Please provide a city or allow location access.");
                return;
            }
            setWeather(response.data);
            setError(null);
        } catch (err) {
            setError("Error fetching weather data");
            setWeather(null);
        }
    }, [city, latitude, longitude]);

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-AU", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    };

    const getIconUrl = (iconCode) =>
        `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

    const getCustomIconUrl = (iconCode) => `/weather-icons/${iconCode}.png`;

    useEffect(() => {
        if (bannerRef.current && weather) {
            const img = bannerRef.current;
            const colorThief = new ColorThief();
            if (img.complete) {
                setBannerColor(colorThief.getColor(img));
            } else {
                img.addEventListener("load", () => {
                    setBannerColor(colorThief.getColor(img));
                });
            }
        }
    }, [weather]);

    useEffect(() => {
        if (!city) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLatitude(latitude);
                        setLongitude(longitude);
                    },
                    (err) => {
                        setError("Error getting location: " + err.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        }
    }, [city]);

    useEffect(() => {
        if (latitude && longitude) {
            getWeather();
        }
    }, [latitude, longitude, getWeather]);

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setLatitude(null);
        setLongitude(null);
    };

    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;

    const bannerStyle = bannerColor
        ? {
              backgroundImage: `linear-gradient(to bottom, rgb(${bannerColor.join(
                  ","
              )}) 10%, ${isNight ? "black" : "white"} 100%)`,
          }
        : {
              backgroundImage: `linear-gradient(to bottom, ${
                  isNight ? "#3A62DF" : "#007bff"
              } 20%, ${isNight ? "black" : "white"} 100%)`, // Default gradient color
          };

    return (
        <div className='App' style={bannerStyle}>
            {weather && (
                <div className='banner'>
                    <img
                        src={getCustomIconUrl(weather.data[0].weather.icon)}
                        alt={weather.data[0].weather.description}
                        ref={bannerRef}
                    />
                    <div className='banner-overlay'>
                        <h1>Weather App</h1>
                    </div>
                </div>
            )}
            {!weather && (
                <div className='banner'>
                    <h1 className='banner-placeholder'>Weather App</h1>
                </div>
            )}
            <input
                type='text'
                value={city}
                onChange={handleCityChange}
                placeholder='Enter city'
            />
            <button onClick={getWeather}>Get Weather</button>
            {error && <p className='err'>{error}</p>}
            {weather && (
                <div>
                    <h2>Weather in {weather.city_name}</h2>
                    <p>{weather.data[0].weather.description}</p>
                    <p>Temperature: {weather.data[0].temp}°C</p>
                    <p>Wind Speed: {weather.data[0].wind_spd} m/s</p>
                    <h3>7-Day Forecast</h3>
                    <table border='1'>
                        <thead>
                            <tr>
                                {weather.data.slice(1).map((day, index) => (
                                    <th key={index}>
                                        {getDayName(day.valid_date)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {weather.data.slice(1).map((day, index) => (
                                    <td key={index}>
                                        <td
                                            className='dateLabel'
                                            data-label='Date'
                                        >
                                            {getDayName(day.valid_date)}
                                        </td>
                                        <div className='content'>
                                            <img
                                                src={getIconUrl(
                                                    day.weather.icon
                                                )}
                                                alt={day.weather.description}
                                            />
                                            <div>
                                                <p>{day.weather.description}</p>
                                                <p>High: {day.temp}°C</p>
                                                <p>Low: {day.min_temp}°C</p>
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <footer className='footer'>
                <p>Daniel Chung © 2024</p>
            </footer>
        </div>
    );
}

export default App;
