import React from "react";

const ForecastTable = ({ weather }) => {
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

    return (
        <div>
            <h3>7-Day Forecast</h3>
            <table border='1'>
                <thead>
                    <tr>
                        {weather.data.slice(1).map((day, index) => (
                            <th key={index}>{getDayName(day.valid_date)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {weather.data.slice(1).map((day, index) => (
                            <td key={index}>
                                <td className='dateLabel' data-label='Date'>
                                    {getDayName(day.valid_date)}
                                </td>
                                <div className='content'>
                                    <img
                                        src={getIconUrl(day.weather.icon)}
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
    );
};

export default ForecastTable;
