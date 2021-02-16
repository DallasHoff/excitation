const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

// Wrapper to catch errors in async routes
let wrap = fn => (...args) => fn(...args).catch(args[2]);



// Test endpoint
app.get('/test', (req, res) => {
    return res.json({message: 'Hello from Excitation!'});
});

// Cite web page
app.get('/cite/webpage', wrap(async (req, res) => {
    var result = {};

    // URL to cite
    var q = req.query.q;
    if (!q) return res.status(400).json({error: 'No URL was provided.'});

    // Make sure URL has protocol
    var url = q;
    if (q.split('//').length === 1) {
        url = 'http://' + q;
    } else if (q.startsWith('//') === true) {
        url = 'http://' + q.replace('//', '');
    }

    // Get web page HTML
    try {
        var {data: html} = await axios.get(url);
        var $ = cheerio.load(html);
    } catch (err) {
        return res.status(400).json({error: 'The URL provided does not lead to a valid web page.'});
    }

    // Extract citation info (TODO)
    var $e = (selector) => $(selector).first().text()?.replace(/\s+/g, ' ') || null;
    var $a = (selector, attribute) => $(selector).first().attr(attribute)?.replace(/\s+/g, ' ') || null;
    var $meta = (name) => $a(`meta[name="${name}"]`, 'content') || $a(`meta[property="${name}"]`, 'content') || null;
    
    result.url = url;
    result.title = $meta('og:title') || 
                    $meta('pagename') || 
                    $e('head title');
    result.author = $meta('author') || 
                    $e('[rel="author"]') || 
                    $meta('web_author');
    result.publication = $meta('og:site_name') || 
                    $meta('application-name') || 
                    $meta('copyright') || 
                    $meta('owner');
    result.modified = $meta('article:modified_time') || 
                    $meta('revised') || 
                    $a('meta[http-equiv="last-modified"]', 'content') || 
                    $a('meta[http-equiv="Last-Modified"]', 'content') || 
                    $a('main time', 'datetime') || 
                    $e('main time');
    result.published = $meta('article:published_time') || 
                    $meta('creation_date') || 
                    $meta('created') || 
                    $a('meta[http-equiv="date"]', 'content') || 
                    $a('meta[http-equiv="Date"]', 'content') || 
                    $a('main time', 'datetime') || 
                    $e('main time') || 
                    result.modified;

    // Respond
    return res.status(200).json(result);
}));



// Handle 404's
app.use((req, res, next) => {
    return res.status(404).json({error: 'The specified endpoint was not found.'});
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({error: 'A server error occurred. Please try again.'});
});

// Listen for requests
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
