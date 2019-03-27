const path = require('path');
const express = require('express');
const mainRouter = express.Router();

/////////////////////////////
/* General Entry endpoints */
/////////////////////////////
const indexHtmlFile = path.resolve(__dirname, '../index.html');
mainRouter.get('/', (req, res) => {
  res.sendFile(indexHtmlFile);
});

const callbackHtmlFile = path.resolve(__dirname, '../callback.html');
mainRouter.get('/callback', async (req, res) => {
  res.sendFile(callbackHtmlFile);
});

module.exports = mainRouter;
