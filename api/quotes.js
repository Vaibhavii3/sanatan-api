const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const quotesFilePath = path.join(__dirname, 'quotes.json');

function getQuotesData() {
    try {
        const data = fs.readFileSync(quotesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading quotes.json:", err);
        return { daily_quotes: [] };
    }
}


module.exports = (req, res) => {
    if (req.method === 'GET' && req.url === '/api/quotes') {
        const quotesData = getQuotesData();
        return res.json(quotesData.daily_quotes);
    }

    if (req.method === 'GET' && req.url.startsWith('/api/quotes/')) {
        const id = req.url.split('/')[3]; 
        const quotesData = getQuotesData();
        const quote = quotesData.daily_quotes.find(q => q.id === id);
        if (quote) {
            return res.json(quote);
        } else {
            return res.status(404).json({ message: "Quote not found" });
        }
    }

    res.status(404).json({ message: 'Route not found' });
};

app.listen(PORT, () => {
    console.log(`server is runing on http://localhost:${PORT}`);
});