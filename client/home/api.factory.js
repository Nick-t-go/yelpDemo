app.factory('API', function($http) {

    return {
        
        autoComplete: function(query, lat, lng) {
        	var config = {
                params: {
                    text: query,
                    latitude: lat ? lat : "",
                    longitude: lng ? lng : ""

                }
            };
            return $http.post("api/auto_complete", config);
        },

        getLocation: function(location){
        	var config = {params:{sensor: true,}};
        	if(location.coords){
        		config.params.latlng = location.coords.latitude +","+location.coords.longitude;
        	}else{
        		config.params.address = location;
        	}
        	return $http.get("https://maps.googleapis.com/maps/api/geocode/json", config);
        },

        yelpSearch: function(term, categories, location){
        	var config = {
        		params:{
        			term:term || "", 
        			categories: categories || ""
        	}};
        	if(location.latitude){
        		config.params.latitude = location.latitude;
        		config.params.longitude = location.longitude;
        	}else{
        		config.params.location = location;
        	}
        	return $http.post("api/search", config);
        }
    };

});