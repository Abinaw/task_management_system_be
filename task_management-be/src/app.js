const express = require('express');
const app = express();

app.use(express.json());

app.get('/test', (req, res) => res.json({ status: 'OK' }));

module.exports = app;