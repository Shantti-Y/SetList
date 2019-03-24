const path = require('path');
const express = require('express');
const mainRouter = express.Router();

/////////////////////////////
/* General Entry endpoints */
/////////////////////////////
const htmlFile = path.resolve(__dirname, '../index.html');
mainRouter.get('/', (req, res) => {
  res.sendFile(htmlFile);
});

module.exports = mainRouter;
