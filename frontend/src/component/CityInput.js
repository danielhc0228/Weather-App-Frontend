import React from "react";

const CityInput = ({ city, handleCityChange, getWeather, setManualToggle }) => {
    return (
        <div>
            <input
                type='text'
                value={city}
                onChange={handleCityChange}
                placeholder='Enter city'
            />
            <button onClick={getWeather}>Get Weather</button>
            <button
                className='darkmode'
                onClick={() => setManualToggle((prev) => !prev)}
            >
                ☼
            </button>
        </div>
    );
};

export default CityInput;
