import React from "react";

const WeatherDetails = ({ weather }) => {
    return (
        <div>
            <h2>Weather in {weather.city_name}</h2>
            <p>{weather.data[0].weather.description}</p>
            <p>Temperature: {weather.data[0].temp}°C</p>
            <p>Wind Speed: {weather.data[0].wind_spd} m/s</p>
        </div>
    );
};

export default WeatherDetails;
