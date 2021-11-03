'use strict';

var app = angular.module("finder", []);

app.controller("PostFinder", [ "$scope", "$http", function($scope, $http) {
    $scope.all_titles = [];
    $http.get('/api/v1.0/titles.json').then(function(response) {
        $scope.all_titles = response.data;
    });
}]);

app.controller("Discussion", [ "$scope", "$http", function($scope, $http) {
    $scope.all_titles = [];
    $http.get('https://api.github.com/repos/s1ng0c/s1ng0c.github.io/issues').then(function(response) {
        console.log(response.data);
    });
}]);