'use strict';

const express = require("express");
const yelp = require('yelp-fusion');
const app = express.Router();

const clientId = "MH4ELBb7gGsONQjHxktnmg"
const clientSecret = "2ZcOFByhjVMBl9FkMGWz63TbFsvBDEyIcitXbtNiKhYOaxZYPwTsXDZQKuicQmxA"

const token = yelp.accessToken(clientId, clientSecret)
    .then(function(response) {
        return response.jsonBody.access_token
    }).catch(e => {
        console.log("error", e);
    });
console.log(token)

app.get("/autoComplete", function(req, res) {
    token.then(function(toke) {
        console.log(req)
        client = yelp.client(toke);
        client.autocomplete({
            text: 'pizza'
        }).then(response => {
            console.log(response.jsonBody.terms[0].text);
        }).catch(e => {
            console.log(e);
        });
    })
})

app.get("/search", function(req, res) {
    let client;
    token.then(function(toke) {
        client = yelp.client(toke);
        client.search({
            term: 'Four Barrel Coffee',
            location: 'san francisco, ca'
        }).then(response => {
            res.send(response.jsonBody)
        }).catch(e => {
            console.log(e)
        })
    })
})

module.exports = app;