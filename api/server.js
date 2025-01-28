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


app.get('/api/quotes', (req, res) => {
    const quotesData = getQuotesData();
    res.json(quotesData.daily_quotes);
});

app.get('/api/quotes/:id', (req,res) => {
    const quotesData = getQuotesData();
    const id = req.params.id;
    const quote = quotesData.daily_quotes.find(q => q.id === id);
    if (quote){
        res.json(quote);
    } else {
        res.status(404).json({ message: "Quote not found" });
    }
});

app.listen(PORT, () => {
    console.log(`server is runing on http://localhost:${PORT}`);
});