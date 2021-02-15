const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

// Test endpoint
app.get('/test', (req, res) => {
    return res.json({message: 'Hello from Excitation!'});
});

// Cite web page
app.get('/cite/webpage', async (req, res) => {
    var result = {};
    // URL to cite
    var q = req.query.q;
    if (!q) return res.status(400).json({error: 'No URL was provided.'});
    // Get web page HTML
    try {
        var {data: html} = await axios.get(q);
        var $ = cheerio.load(html);
    } catch (err) {
        return res.status(400).json({error: 'The URL provided does not lead to a valid web page.'});
    }
    // Extract citation info (TODO)
    result.title = $('head title').first().text().trim();
    // Respond
    return res.status(200).json(result);
});

// Handle 404's
app.use((req, res, next) => {
    return res.status(404).json({error: 'Endpoint Not Found'});
});

// Listen for requests
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
