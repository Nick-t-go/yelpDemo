app.factory('API', function($http) {

    return {
        autoComplete: function(query) {
            return $http.get("api/autocomplete");
        }
    };

});