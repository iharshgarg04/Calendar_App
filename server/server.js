const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.get('/api', async (req, res) => {
    try {
        const apiKey = 'ng0MdemIuPCZp7dRzffbGA==TVRD6PdYa4QMVDfT';
        const year = req.query.year;
        console.log(year);
        const apiUrl = `https://api.api-ninjas.com/v1/holidays?country=india&year=${year}`;

        const response = await axios.get(apiUrl, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });

        const data = response.data;
        res.json(data);
        console.log(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});
