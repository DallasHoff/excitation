const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

// Wrapper to catch errors in async routes
let wrap = fn => (...args) => fn(...args).catch(args[2]);



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
    var clean = (text) => text?.replace(/\s+/g, ' ')?.trim();
    var $elem = (selector, multi) => {
        if (multi) {
            var results = [];
            $(selector).each((i, el) => {
                var text = $(el).text();
                results.push(clean(text));
            });
            return results.length > 0 ? results : null;
        }
        return clean($(selector).first().text()) || null;
    }
    var $attr = (selector, attribute, multi) => {
        if (multi) {
            var results = [];
            $(selector).each((i, el) => {
                var text = $(el).attr(attribute);
                results.push(clean(text));
            });
            return results.length > 0 ? results : null;
        }
        return clean($(selector).first().attr(attribute)) || null;
    }
    var $meta = (name, multi) => $attr(`meta[name="${name}"]`, 'content', multi) || $attr(`meta[property="${name}"]`, 'content', multi);
    
    result.url = $attr('link[rel="canonical"]', 'href') || 
                    url;
    result.title = $meta('citation_title') || 
                    $meta('og:title') || 
                    $meta('twitter:title') || 
                    $meta('pagename') || 
                    $elem('head title');
    result.authors = $meta('citation_author', true) || 
                    $meta('author', true) || 
                    $elem('[rel="author"]', true) || 
                    $meta('web_author', true);
    result.publication = $meta('citation_journal_title') || 
                    $meta('og:site_name') || 
                    $meta('application-name') || 
                    $meta('apple-mobile-web-app-title') || 
                    $meta('copyright') || 
                    $meta('owner');
    result.modifiedTime = $meta('article:modified_time') || 
                    $meta('revised') || 
                    $attr('meta[http-equiv="last-modified"]', 'content') || 
                    $attr('meta[http-equiv="Last-Modified"]', 'content') || 
                    $attr('main time', 'datetime') || 
                    $elem('main time');
    result.publishedTime = $meta('citation_publication_date') || 
                    $meta('citation_date') || 
                    $meta('article:published_time') || 
                    $meta('creation_date') || 
                    $meta('created') || 
                    $attr('meta[http-equiv="date"]', 'content') || 
                    $attr('meta[http-equiv="Date"]', 'content') || 
                    $attr('main time', 'datetime') || 
                    $elem('main time') || 
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
