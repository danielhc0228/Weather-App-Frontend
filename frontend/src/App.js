import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ColorThief from "colorthief";
import Banner from "./component/Banner";
import CityInput from "./component/CityInput";
import WeatherDetails from "./component/WeatherDetails";
import ForecastTable from "./component/ForecastTable";
import Footer from "./component/Footer";
import "./App.css";

function App() {
    const [city, setCity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [bannerColor, setBannerColor] = useState(null);
    const bannerRef = useRef();

    const currentHour = new Date().getHours();
    const [manualToggle, setManualToggle] = useState(null);

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

    const isNight = currentHour >= 18 || currentHour < 6;

    const bannerStyle = bannerColor
        ? {
              backgroundImage: `linear-gradient(to bottom, rgb(${bannerColor.join(
                  ","
              )}) 10%, ${
                  manualToggle !== null
                      ? manualToggle
                          ? "black"
                          : "white"
                      : isNight
                      ? "black"
                      : "white"
              } 100%)`,
          }
        : {
              backgroundImage: `linear-gradient(to bottom, ${
                  manualToggle !== null
                      ? manualToggle
                          ? "#3A62DF"
                          : "#007bff"
                      : isNight
                      ? "#3A62DF"
                      : "#007bff"
              } 20%, ${
                  manualToggle !== null
                      ? manualToggle
                          ? "black"
                          : "white"
                      : isNight
                      ? "black"
                      : "white"
              } 100%)`, // Default gradient color
          };

    return (
        <div className='App' style={bannerStyle}>
            <Banner weather={weather} bannerRef={bannerRef} />
            <CityInput
                city={city}
                handleCityChange={handleCityChange}
                getWeather={getWeather}
                setManualToggle={setManualToggle}
            />
            {error && <p className='err'>{error}</p>}
            {weather && (
                <>
                    <WeatherDetails weather={weather} />
                    <ForecastTable weather={weather} />
                </>
            )}
            <Footer />
        </div>
    );
}

export default App;
