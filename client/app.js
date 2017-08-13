'use strict';

window.app = angular.module('yelpApp', ['ui.router', 'ngAnimate', "angularMoment",'ngMaterial']);



app.config(function($urlRouterProvider, $stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: './client/home/home.html',
            controller: 'homeCtrl'
        })
    $urlRouterProvider.otherwise('/home');    
})