const express = require('express');
const app = express();
const port = 3000;

// Test endpoint
app.get('/test', (req, res) => {
    res.json({message: 'Hello from Excitation!'});
});

// Handle 404's
app.use((req, res, next) => {
    res.status(404).json({error: '404: Endpoint Not Found'});
});

// Listen for requests
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
