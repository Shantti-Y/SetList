const path = require('path');
const express = require('express');
const mainRouter = express.Router();

const { postFetchingAuthorizationToken } = require('../utils/authentication');

/////////////////////////////
/* General Entry endpoints */
/////////////////////////////
const indexHtmlFile = path.resolve(__dirname, '../templates/index.html');
mainRouter.get('/(*{0}|home|about)', (_, res) => {
  res.sendFile(indexHtmlFile);
});

mainRouter.get('/callback', async (req, res) => {
  // spotifyからauth_tokenとtoekn_typeとexpiredを取得
  if (req.query.code !== undefined) {
    const authorizationData = await postFetchingAuthorizationToken('authorization_code', req.query.code);
    // localstorageにauth_token、expired、現在時刻を設置
    const urlParams = Object.keys(authorizationData).map((key) => `${key}=${authorizationData[key]}`).join('&');
    res.redirect(`auth_token?${urlParams}`);
  } else {
    res.status(404).send({
      error: {
        status: 404,
        message: `Couldn't create playlist due to lack of tracks.`
      }
    });
  }
});

const callbackHtmlFile = path.resolve(__dirname, '../templates/callback.html');
mainRouter.get('/auth_token', async (_, res) => {
  res.sendFile(callbackHtmlFile);
});

module.exports = mainRouter;
