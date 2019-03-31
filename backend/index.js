const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
require('dotenv').config();

const distDir = path.resolve(__dirname, `../dist/dev`);

const mainApp = express();
const apiApp = express();

apiApp.use(express.static(distDir));
apiApp.use(router.apiRouter);

mainApp.use(bodyParser.json());
mainApp.use(bodyParser.urlencoded({ extended: true }));
mainApp.use(express.static(distDir));
mainApp.use(router.mainRouter);
mainApp.use('/api', apiApp);

const PORT = process.env.PORT || 8080;
mainApp.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
