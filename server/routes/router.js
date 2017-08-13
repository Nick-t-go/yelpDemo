'use strict';

const express = require("express");
const yelp = require('yelp-fusion');
const app = express.Router();

const clientId = "MH4ELBb7gGsONQjHxktnmg";
const clientSecret = "2ZcOFByhjVMBl9FkMGWz63TbFsvBDEyIcitXbtNiKhYOaxZYPwTsXDZQKuicQmxA";

function getYelpToken() {
    return yelp.accessToken(clientId, clientSecret)
        .then(response => {
            return response.jsonBody.access_token;
        });
}

app.use('/', (req, res, next) => {
    const token = app.get('YELP_TOKEN');

    if (token) {
        req.yelpToken = token;
        next();
    } else {
        getYelpToken()
            .then(t => {
                app.set('YELP_TOKEN', t);
                req.yelpToken = t;
                next();
            })
            .catch(next);
    }
});

app.get("/autoComplete", function(req, res) {
    const client = yelp.client(req.yelpToken);
    client.autocomplete({
        text: 'pizza'
    }).then(response => {
        console.log(response.jsonBody.terms[0].text);
    }).catch(e => {
        console.log(e);
    });
});

app.get("/search", function(req, res) {
    const client = yelp.client(req.token);

    client.search({
        term: 'Four Barrel Coffee',
        location: 'san francisco, ca'
    }).then(response => {
        res.send(response.jsonBody);
    }).catch(e => {
        console.log(e);
    });
});

module.exports = app;