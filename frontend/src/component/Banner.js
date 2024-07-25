import React from "react";

const Banner = ({ weather, bannerRef }) => {
    const getCustomIconUrl = (iconCode) => `/weather-icons/${iconCode}.png`;

    return (
        <div className='banner'>
            {weather ? (
                <>
                    <img
                        src={getCustomIconUrl(weather.data[0].weather.icon)}
                        alt={weather.data[0].weather.description}
                        ref={bannerRef}
                    />
                    <div className='banner-overlay'>
                        <h1>Weather App</h1>
                    </div>
                </>
            ) : (
                <h1 className='banner-placeholder'>Weather App</h1>
            )}
        </div>
    );
};

export default Banner;
