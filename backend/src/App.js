import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ColorThief from "colorthief";
import "./App.css";

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [bannerColor, setBannerColor] = useState(null);
    const bannerRef = useRef();

    const getWeather = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/weather?city=${city}`
            );
            setWeather(response.data);
            setError(null);
        } catch (err) {
            setError("Error fetching weather data");
            setWeather(null);
        }
    };

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

    // const getIconUrl = (iconCode) =>
    //     `http://localhost:4000/proxy?url=${encodeURIComponent(
    //         `https://www.weatherbit.io/static/img/icons/${iconCode}.png`
    //     )}`;

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

    const bannerStyle = bannerColor
        ? {
              backgroundImage: `linear-gradient(to bottom, rgb(${bannerColor.join(
                  ","
              )}) 20%, white 100%)`,
          }
        : {};

    return (
        <div className='App' style={bannerStyle}>
            {weather && (
                <div className='banner'>
                    <img
                        src={getCustomIconUrl(weather.data[0].weather.icon)}
                        alt={weather.data[0].weather.description}
                        ref={bannerRef}
                        className='banner-img'
                    />
                    <div className='banner-overlay'>
                        <h1>Weather App</h1>
                    </div>
                </div>
            )}
            {!weather && <h1 className='banner-placeholder'>Weather App</h1>}
            <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Enter city'
            />
            <button onClick={getWeather}>Get Weather</button>
            {error && <p>{error}</p>}
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
                                        <img
                                            src={getIconUrl(day.weather.icon)}
                                            alt={day.weather.description}
                                        />
                                        <p>
                                            {day.weather.description},{" "}
                                            {day.temp}°C
                                        </p>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
