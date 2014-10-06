'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MapController', ['$scope', '$http', 'leafletData', 'drawsvg', function($scope, $http, leafletData, drawsvg) {
  	angular.extend($scope, {
  		raleigh: {
  			lat: 35.83,
  			lng: -78.6436,
  			zoom: 11
  		},
  		tiles: {
  			url: 'http://a.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png'
  		}
  	});
  	$http.get("data/fiber.geojson").success(function(data, status) {
        angular.extend($scope, {
            geojson: {
                data: data,
                style: {
                }
            }
        });
    });
    $scope.$on('leafletDirectiveMap.geojsonMouseover', function (e, leafletEvent) {

    	angular.extend($scope, {
			properties: leafletEvent.target.feature.properties,
			proposed: leafletEvent.target.feature.properties.new_serv,
			current: leafletEvent.target.feature.properties.speed
    	});
    	$scope.callDrawsvg = function (speed, path) {
    		drawsvg(speed, path);
    	};
    	// var timer = setInterval(function () {
	    // 	$scope.proposed += 10;
	    // 	if ($scope.proposed === 1000) {
	    // 		clearInterval(timer)
	    // 	}
    	// }, 1);


    	$scope.callDrawsvg(leafletEvent.target.feature.properties.new_serv, document.querySelector('.proposed-line path'));
    	$scope.callDrawsvg(leafletEvent.target.feature.properties.speed, document.querySelector('.current-line path'));

    });


  }]);
