const fs = require('fs');
const path = require("path");

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
