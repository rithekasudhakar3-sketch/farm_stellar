const express = require('express');
const router = express.Router();
const axios = require('axios');

// Weather API proxy endpoint
router.get('/forecast', async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY || 'f36aabc0f660437ba1a91516250410';
    
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=2&aqi=no&alerts=yes`;
    
    console.log('Fetching weather for:', location);
    
    const response = await axios.get(url);
    
    res.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error?.message || 'Failed to fetch weather data'
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
