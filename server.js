const express = require('express');
const app = express();

// routes
app.get('/', (req, res) => {
    res.send('Hello MYK.')
})

app.listen(3002, () => {
    console.log("API is running on port 3002")
})