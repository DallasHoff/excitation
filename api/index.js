require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const parseFullName = require('parse-full-name').parseFullName;

const app = express();
const port = process.env.EXPRESS_PORT;


// Wrapper to catch errors in async routes
const wrap = fn => (...args) => fn(...args).catch(args[2]);

// Read request query value, ignoring multiples
const queryVal = (queryItem) => Array.isArray(queryItem) ? queryItem[0] : queryItem;



// Cite web page
app.get('/cite/webpage', wrap(async (req, res) => {
    var results = [];
    var result = {};

    // URL to cite
    var q = queryVal(req.query.q);
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

    // Extract citation info
    var clean = (text) => text?.replace(/\s+/g, ' ')?.trim();
    var $elem = (selector, multi) => {
        if (multi) {
            var hits = [];
            $(selector).each((i, el) => {
                var text = clean($(el).text());
                if (text) hits.push(text);
            });
            return hits.length > 0 ? hits : null;
        }
        return clean($(selector).first().text()) || null;
    }
    var $attr = (selector, attribute, multi) => {
        if (multi) {
            var hits = [];
            $(selector).each((i, el) => {
                var text = clean($(el).attr(attribute));
                if (text) hits.push(text);
            });
            return hits.length > 0 ? hits : null;
        }
        return clean($(selector).first().attr(attribute)) || null;
    }
    var $meta = (name, multi) => $attr(`meta[name="${name}"]`, 'content', multi) || $attr(`meta[property="${name}"]`, 'content', multi);
    
    result.url = (
        $attr('link[rel="canonical"]', 'href') || 
        url
    );
    result.title = (
        $meta('citation_title') || 
        $meta('og:title') || 
        $meta('twitter:title') || 
        $meta('pagename') || 
        $elem('head title')
    );
    result.authors = (
        $meta('citation_author', true) || 
        $meta('author', true) || 
        $meta('article:author') || 
        $elem('[rel="author"]', true) || 
        $meta('web_author', true)
    );
    result.publication = (
        $meta('citation_journal_title') || 
        $meta('og:site_name') || 
        $meta('application-name') || 
        $meta('apple-mobile-web-app-title') || 
        $meta('copyright') || 
        $meta('owner')
    );
    result.modifiedTime = (
        $meta('article:modified_time') || 
        $meta('article:modified') || 
        $meta('lastmod') || 
        $meta('og:lastmod') || 
        $meta('revised') || 
        $attr('main time', 'datetime') || 
        $elem('main time')
    );
    result.publishedTime = (
        $meta('citation_publication_date') || 
        $meta('citation_date') || 
        $meta('article:published_time') || 
        $meta('article:published') || 
        $meta('pubdate') || 
        $meta('og:pubdate') || 
        $attr('time[pubdate]', 'datetime') || 
        $meta('creation_date') || 
        $meta('created') || 
        $attr('main time', 'datetime') || 
        $elem('main time') || 
        result.modifiedTime
    );
    result.isbn = (
        $meta('citation_isbn', true)
    );

    // Standardize field formats
    if (result.authors !== null) result.authors = result.authors.map(v => parseFullName(v));
    if (result.modifiedTime !== null) result.modifiedTime = new Date(result.modifiedTime);
    if (result.publishedTime !== null) result.publishedTime = new Date(result.publishedTime);
    result.formatType = 'webpage';

    // Respond
    results.push(result);
    return res.status(200).json(results);
}));


// Cite book
app.get('/cite/book', wrap(async (req, res) => {
    var results = [];

    // Search term for book
    var q = queryVal(req.query.q);
    q = encodeURIComponent(q);
    if (!q) return res.status(400).json({error: 'No search term was provided.'});

    // Do search with Google Books API
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const fetchFields = 'items(volumeInfo(title,authors,publisher,publishedDate,industryIdentifiers,printType))';
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?key=${apiKey}&q=${q}&fields=${fetchFields}`;

    try {
        var {data: {items: books}} = await axios.get(searchUrl);
    } catch (err) {
        return res.status(502).json({error: 'An error occurred with your search. Please try again.'});
    }

    if (!books) return res.status(200).json([]);

    // Standardize field formats
    results = books.map?.(b => {
        var result = {};
        var info = b.volumeInfo;

        var collectIdentifiers = (searchStr) => {
            var hits = [];
            var identifiers = info?.industryIdentifiers;
            if (!identifiers || !Array.isArray(identifiers)) return null;

            if (searchStr) hits = identifiers.filter(v => v?.type?.toLowerCase().includes(searchStr) || false);
            hits = hits.map(v => v.identifier);

            return hits.length > 0 ? hits : null;
        }

        result.title = info.title || null;
        result.authors = info?.authors?.map(a => parseFullName(a)) || null;
        result.publisher = info.publisher || null;
        result.publishedTime = info.publishedDate ? new Date(info.publishedDate) : null;
        result.isbn = collectIdentifiers('isbn');
        result.formatType = info?.printType?.toLowerCase() || null;

        return result;
    });

    // Respond
    return res.status(200).json(results || []);
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
