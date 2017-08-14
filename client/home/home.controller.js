app.controller('homeCtrl', function($scope, API, $timeout, $window) {
	$scope.propertyName = 'name';
	$scope.reverse = false;
    $scope.searchTypes = [
        { label: 'Search', sType: 'terms', displayString: 'text', defaultValue: '', searchValue: "" },
        { label: 'Location', sType: 'location', displayString: 'formatted_address', defaultValue: 'New York, NY', searchValue: "", latlng: false },
        { label: 'Categories', sType: 'categories', displayString: 'alias', defaultValue: 'restaurants', searchValue: "" }
    ];

    $scope.position = {}

    $scope.goTo = function(url){
    	$window.open(url)
    }

    $scope.querySearch = function(query, sType) {
        if (sType === "location") {
            return API.getLocation(query).then(function(results) {
            	return results.data.results
            })
        }
        return API.autoComplete(query, $scope.searchTypes[1].latitude, $scope.searchTypes[1].longitude)
            .then(function(response) {
                if (sType === 'terms' && response.data.businesses) {
                    response.data.businesses.forEach(function(business) {
                        response.data.terms.push({ text: business.name })
                    })
                    return response.data[sType]
                } else {
                    return response.data[sType]
                }
            })
    };

    $scope.searchChanged = function(sType, item) {
    	console.log('change')
        if(sType === 'location' && item){
        	$scope.searchTypes[1].latitude = item.geometry.location.lat;
            $scope.searchTypes[1].longitude = item.geometry.location.lng;
        	$scope.searchTypes[1].latlng = true;
        }    	
    }

    $scope.search = function(){
    	$scope.error = "";
    	$scope.waiting = true;
    	var term = $scope.searchTypes[0].searchValue;
    	var location = $scope.searchTypes[1].searchValue;
    	var categories = $scope.searchTypes[2].searchValue;
    	if($scope.searchTypes[1].latlng){
    		location = {
    			latitude:$scope.searchTypes[1].latitude,
    			longitude:$scope.searchTypes[1].longitude
    		}
    	}
    	API.yelpSearch(term, categories, location).then(function(response){
    		$scope.waiting = false;
    		$scope.searchResults = response.data.businesses;
    		if(response.data.businesses.length === 0){
    			$scope.error = "Refine Your Search And Try Again"
    		}
    	})
    }

    $scope.textChange = function(sType){
    	if(sType === 'location'){
    		$scope.searchTypes[1].latlng = false;
    	}
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                console.log(position)
                $scope.searchTypes[1].latitude = position.coords.latitude
                $scope.searchTypes[1].longitude = position.coords.longitude
                $scope.searchTypes[1].latlng = true;
                API.getLocation(position).then(function(results) {
                    $scope.searchTypes[1].searchValue = results.data.results.filter(function(location) {
                        return location.geometry.location_type === "APPROXIMATE"
                    })[0].formatted_address
                })
            });
        });
    }


});