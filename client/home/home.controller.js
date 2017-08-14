app.controller('homeCtrl', function($scope, API){
	console.log('home');

	$scope.querySearch = function(query) {
      API.autoComplete(query).then(function(response){
      	console.log(response);
      });
    };


});