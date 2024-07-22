require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.weatherbit.io/v2.0/forecast/daily";

app.get("/weather", async (req, res) => {
    try {
        const city = req.query.city;
        const response = await axios.get(
            `${BASE_URL}?city=${city}&key=${API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            res.status(500).send("No response from weather API");
        } else {
            res.status(500).send("Error fetching weather data");
        }
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
