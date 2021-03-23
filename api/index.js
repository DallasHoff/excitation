require('firebase-functions/lib/logger/compat');
const path = require('path');
const cors = require('cors');
const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const crc32 = require('crc32');
const parseFullName = require('parse-full-name').parseFullName;

const isCloudFunctionEnv = !!process.env.FUNCTION_TARGET;
const envConfigFile = isCloudFunctionEnv ? '.env.functions' : '.env';
require('dotenv').config({path: path.resolve(process.cwd(), envConfigFile)});

const app = express();
const port = process.env.EXPRESS_PORT;

// Enable CORS
app.use(cors());

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
    console.log(`Searched for: ${q}`);

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

    // Begin extracting citation info
    var clean = (text) => text?.replace?.(/\s+/g, ' ')?.trim();

    // Schema.org metadata
    var schemas = [];
    // Collect JSON-LD
    $('script[type="application/ld+json"]').each((i, el) => {
        var schemaJSON = null;
        var schemaContext = null;
        try {
            schemaJSON = JSON.parse($(el).html());
            [schemaContext] = schemaJSON?.['@context']?.match(/^https?:\/\/schema\.org/) || [];
        } catch (err) {}
        if (schemaJSON && schemaContext) {
            if (Array.isArray(schemaJSON?.['@graph'])) {
                // Split array of multiple schemas
                schemaJSON['@graph'].map(graphSchemaJSON => {
                    graphSchemaJSON['@context'] = schemaContext;
                    schemas.push(graphSchemaJSON);
                });
            } else {
                schemas.push(schemaJSON);
            }
        }
    });

    // Schema.org microdata and RDFa
    var microdata = [];
    const itemSelector = '[itemscope][itemtype], [typeof]';
    const propSelector = '[itemprop], [property]';
    // Collect each microdata/RDFa item
    $(itemSelector).each((i, el) => {
        var item = {};
        var parentItem = $(el).parents(itemSelector).first();
        if ($(el).is('[itemscope][itemtype]')) {
            // Microdata
            var itemprop = $(el).attr('itemprop');
            var itemtypeRef = $(el).attr('itemtype');
            var [match, context, type] = itemtypeRef?.match?.(/^(https?:\/\/schema\.org)\/(\w+)/) || [];
        } else if ($(el).is('[typeof]')) {
            // RDFa
            var itemprop = $(el).attr('property');
            var itemtypeRef = $(el).attr('typeof');
            var type = $(el).attr('typeof');
            var [match, context] = ($(el).attr('vocab') || $(el).parents('[vocab]').first().attr('vocab'))?.match?.(/^(https?:\/\/schema\.org)/) || [];
        }
        // Only use items with schema.org vocabulary and type defined
        if (context && type) {
            item['@context'] = context;
            item['@type'] = type;
            // Info for reconstructing item hierarchy
            item['$itemProp'] = itemprop;
            item['$itemKey'] = crc32($(el).html());
            item['$parentItemKey'] = crc32(parentItem.html());
            // Collect item's properties
            $(propSelector, el).each((i, el) => {
                var prop = $(el).attr('itemprop') || $(el).attr('property');
                // Make sure property belongs to the current scope
                var parentItem = $(el).parents(itemSelector).first();
                var isInNestedItem = (parentItem.attr('itemtype') || parentItem.attr('typeof')) !== itemtypeRef;
                var isNestedItem = $(el).is(itemSelector);
                if (isInNestedItem || isNestedItem) return; // continue
                // Collect property value
                var propvalue = (
                    ($(el).is('time') ? clean($(el).attr('datetime')) : null) || 
                    ($(el).is('link') ? clean($(el).attr('href')) : null) || 
                    ($(el).is('img') ? clean($(el).attr('src')) : null) || 
                    clean($(el).attr('content')) || 
                    clean($(el).text()) || 
                    true
                );
                // Use array for repeated properties
                if (item[prop]) {
                    if (!Array.isArray(item[prop])) {
                        item[prop] = [item[prop]];
                    }
                    item[prop].push(propvalue);
                } else {
                    item[prop] = propvalue;
                }
            });
            // Add item to collection of microdata info
            microdata.push(item);
        }
    });

    // Reconstruct schema item hierarchy
    var microdataTrees = [];
    var findChildItems = (parentKey, searchBranch) => {
        // Find children of this item
        microdata.map(item => {
            var itemParentKey = item?.['$parentItemKey'];
            var itemKey = item?.['$itemKey'];
            var itemProp = item?.['$itemProp'];
            if (itemParentKey === parentKey) {
                // Move item to its parent and recursively find child items
                if (itemParentKey === '0') {
                    microdataTrees.push(item);
                    if (itemKey && itemKey !== '0') findChildItems(itemKey, microdataTrees);
                } else if (searchBranch) {
                    var parentBranch = null;
                    for (var i in searchBranch) {
                        parentBranch = searchBranch[i];
                        if (Array.isArray(parentBranch)) {
                            var multiItemIndex = parentBranch.findIndex(a => itemParentKey === a?.['$itemKey']);
                            if (multiItemIndex < 0) continue; 
                            parentBranch = searchBranch[i][multiItemIndex];
                        }
                        if (itemParentKey === parentBranch?.['$itemKey'] && itemProp) {
                            delete item['@context'];
                            // Use array for repeated properties
                            if (parentBranch[itemProp]) {
                                if (!Array.isArray(parentBranch[itemProp])) {
                                    parentBranch[itemProp] = [parentBranch[itemProp]];
                                }
                                parentBranch[itemProp].push(item);
                            } else {
                                parentBranch[itemProp] = item;
                            }
                            break;
                        }
                    }
                    if (itemKey && itemKey !== '0' && parentBranch) findChildItems(itemKey, parentBranch);
                }
            }
        });
    }
    // Start from items with no parents
    findChildItems('0', null);

    // Add schema item info, now formatted like JSON-LD, to schemas collection
    schemas = [...schemas, ...microdataTrees];

    // Choose main Schema.org schema
    var mainSchema = {};
    // Schema types ordered by priority
    const recognizedTypes = ['Article', 'ScholarlyArticle', 'MedicalScholarlyArticle', 'NewsArticle', 'TechArticle', 'AnalysisNewsArticle', 'ReportageNewsArticle', 'ReviewNewsArticle', 'AskPublicNewsArticle', 'BackgroundNewsArticle', 'OpinionNewsArticle', 'Thesis', 'BlogPosting', 'LiveBlogPosting', 'Report', 'Guide', 'HowTo', 'WebPage', 'AboutPage', 'ProfilePage', 'ContactPage', 'FAQPage', 'ItemPage', 'MedicalWebPage', 'QAPage', 'Review', 'ClaimReview', 'CriticReview', 'MediaReview', 'EmployerReview', 'SocialMediaPosting', 'WebContent', 'HealthTopicContent', 'LearningResource', 'Course', 'AmpStory', 'Recipe', 'RealEstateListing', 'Recommendation', 'Quotation', 'UserReview', 'Blog', 'WebSite', 'CreativeWork'];
    // Choose by priority and order on page
    for (var type of recognizedTypes) {
        var schemaChosen = false;
        for (var schema of schemas) {
            if (schema['@type'] === type) {
                mainSchema = schema;
                schemaChosen = true;
                break;
            }
        }
        if (schemaChosen === true) break;
    }

    // Choose citation info by priority
    var $schema = (propName, item, multi, getURL) => {
        var property = item ? item[propName] : mainSchema[propName];
        if (typeof property === 'string' || typeof property === 'number') {
            return multi ? [property] : property;
        } else if (Array.isArray(property)) {
            if (multi) {
                return property.map((v, i) => $schema(i, property, false, getURL));
            } else {
                return $schema(0, property, multi, getURL);
            }
        } else if (typeof property === 'object') {
            var checkForKey = getURL ? 'url' : 'name';
            if (property[checkForKey]) {
                return $schema(checkForKey, property, multi, getURL);
            } else if (property['@id']) {
                for (var schema of schemas) {
                    if (schema?.['@id'] === property['@id'] && schema?.[checkForKey]) {
                        return $schema(checkForKey, schema, multi, getURL);
                    }
                }
            }
        }
        return null;
    }
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
        $schema('url') || 
        $meta('og:url') || 
        url
    );
    result.title = (
        $meta('citation_title') || 
        $schema('headline') || 
        $meta('og:title') || 
        $meta('twitter:title') || 
        $meta('pagename') || 
        $elem('head title')
    );
    result.authors = (
        $meta('citation_author', true) || 
        $meta('author', true) || 
        (() => {
            var a = Array.from(new Set([
                ...$schema('author', null, true) || [],
                ...$schema('creator', null, true) || [],
                ...$schema('contributor', null, true) || []
            ]));
            return a.length > 0 ? a : null;
        })() || 
        $meta('article:author') || 
        $elem('[rel="author"]', true) || 
        $meta('web_author', true)
    );
    result.publication = (
        $meta('citation_journal_title') || 
        $schema('publisher') || 
        $meta('application-name') || 
        $meta('og:site_name') || 
        $meta('apple-mobile-web-app-title') || 
        $schema('copyrightHolder') || 
        $meta('copyright') || 
        $meta('owner')
    );
    result.modifiedTime = (
        $schema('dateModified') || 
        $meta('article:modified_time') || 
        $meta('article:modified') || 
        $meta('og:updated_time') || 
        $meta('lastmod') || 
        $meta('og:lastmod') || 
        $meta('revised') || 
        $attr('main time', 'datetime') || 
        $elem('main time')
    );
    result.publishedTime = (
        $meta('citation_publication_date') || 
        $meta('citation_date') || 
        $schema('datePublished') || 
        $schema('dateCreated') || 
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
    result.image = (
        $schema('thumbnailUrl') || 
        $meta('thumbnail') || 
        $meta('og:image:secure_url') || 
        $meta('og:image:url') || 
        $meta('og:image') || 
        $schema('image', null, false, true) || 
        $meta('twitter:image:src') || 
        $meta('twitter:image')
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
    console.log(`Searched for: ${q}`);

    // Do search with Google Books API
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const fetchFields = 'items(volumeInfo(title,authors,publisher,publishedDate,industryIdentifiers,printType,imageLinks,canonicalVolumeLink))';
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?country=US&key=${apiKey}&q=${q}&fields=${fetchFields}`;

    try {
        var {data: {items: books}} = await axios.get(searchUrl);
    } catch (err) {
        console.error(err);
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
        result.image = info?.imageLinks?.thumbnail || null;
        result.url = info.canonicalVolumeLink || null;
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
if (isCloudFunctionEnv === false) {
    app.listen(port, () => {
        console.log(`Express app listening at http://localhost:${port}`);
    });
}

// Export for Firebase Cloud Functions
exports.apiFunction = functions.https.onRequest(app);
