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
    var $e = (selector) => $(selector).first().text()?.trim() || null;
    var $a = (selector, attribute) => $(selector).first().attr(attribute)?.trim() || null;
    var $meta = (name) => $a(`meta[name="${name}"]`, 'content') || $a(`meta[property="${name}"]`, 'content') || null;

    result.title = $meta('og:title') || 
                    $e('head title');
    result.author = $meta('author') || 
                    $e('[rel="author"]') || 
                    $meta('web_author');
    result.publisher = $meta('copyright') || 
                    $meta('og:site_name') || 
                    $meta('owner');
    result.modified = $meta('article:modified_time') || 
                    $meta('revised');
    result.published = $meta('article:published_time') || 
                    result.modified;

    // Respond
    return res.status(200).json(result);
});

// Handle 404's
app.use((req, res, next) => {
    return res.status(404).json({error: 'The specified endpoint was not found.'});
});

// Handle errors
app.use((err, req, res, next) => {
    return res.status(500).json({error: 'A server error occurred. Please try again.'});
});

// Listen for requests
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
