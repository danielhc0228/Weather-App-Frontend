require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.get("/weather", async (req, res) => {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.API_KEY;
    try {
        let response;
        if (city) {
            response = await axios.get(
                `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`
            );
        } else if (lat && lon) {
            response = await axios.get(
                `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${apiKey}`
            );
        } else {
            return res.status(400).send("City or coordinates are required");
        }
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Error fetching weather data");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
