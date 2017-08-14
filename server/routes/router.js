'use strict';

const express = require("express");
const yelp    = require('yelp-fusion');
const router  = express.Router();

const clientId     = 'MH4ELBb7gGsONQjHxktnmg';
const clientSecret = '2ZcOFByhjVMBl9FkMGWz63TbFsvBDEyIcitXbtNiKhYOaxZYPwTsXDZQKuicQmxA';

function getYelpToken() {
  return yelp.accessToken(clientId, clientSecret)
    .then(response => {
      return response.jsonBody.access_token;
    });
}

router.use((req, res, next) => {
  const token = req.app.get('YELP_TOKEN');

  if (token) {
    req.yelpToken = token;
    next();
  } else {
    getYelpToken()
      .then(t => {
        req.app.set('YELP_TOKEN', t);
        req.yelpToken = t;
        next();
      })
      .catch(next);
  }
});

router.post('/auto_complete', (req, res, next) => {
  const client = yelp.client(req.yelpToken);
  let params = req.body.params;
  let searchParams = params.latitude ? 
  { text: params.text, latitude: params.latitude, longitude: params.longitude } :
  { text: params.text }
  client.autocomplete(req.body.params)
    .then(response => {
      res.json(response.jsonBody);
    })
    .catch(next);
});

router.post('/search', (req, res, next) => {
  const client = yelp.client(req.yelpToken);
  client.search(req.body.params)
    .then(response => {
      res.json(response.jsonBody);
    })
    .catch(next);
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});

module.exports = router;