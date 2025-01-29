const fs = require("fs");
const path = require("path");

const quotesFilePath = path.join(process.cwd(), 'quotes.json');

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
    res.setHeader("Access-Control-Allow-Origin", "*");  // Allow requests from any origin
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    const { method } = req;
    const { id } = req.query;

    const quotesData = getQuotesData();

    // handle GET /api/quotes
    if (method === 'GET' && !id) {
        return res.status(200).json(quotesData.daily_quotes);
    }

    // handle GET /api/quotes/:id
    if (method === 'GET' && id) {
        const quote = quotesData.daily_quotes.find(q => q.id === id);
        if (quote) {
            return res.status(200).json(quote);
        } else {
            return res.status(404).json({ message: "Quote not found" });
        }
    }

    // Default: Route not found
    res.status(404).json({ message: 'Route not found' });
};
