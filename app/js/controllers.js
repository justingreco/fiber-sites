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
                style: 
                  function (feature) {return {};},
                  pointToLayer: function(feature, latlng) {
                      var iconUrl = "img/marker-green.png",
                        iconRetinaUrl = "img/marker-green-2x.png";
                      switch (feature.properties.provider) {
                          case "Time Warner Cable":
                            iconUrl = "img/marker-icon.png";
                            iconRetinaUrl = "img/marker-icon-2x.png";
                          break;
                          case "AT&T":
                            iconUrl = "img/marker-orange.png";
                            iconRetinaUrl = "img/marker-orange-2x.png";
                          break;
                      }
                      return new L.marker(latlng, {icon: L.icon({iconUrl:iconUrl, iconRetina:iconRetinaUrl})});
                  
                }
            }
        });
    });

    $scope.updateSiteInfo = function (feature) {
     var properties = feature.properties,
        provider = "img/raleigh.png";
      switch (properties.provider) {
        case "Time Warner Cable":
          provider = "img/twc.png";
        break;
        case "AT&T":
          provider = "img/att.png";
        break;
      }
      angular.extend($scope, {
      provider: provider,
      site: properties.site,
      proposed_dl: properties.dl_fut,
      current_dl: properties.dl_curr,
      proposed_ul: properties.ul_fut,
      current_ul: properties.ul_curr,
      currentCost: properties.cost_curr,
      futureCost: properties.cost_fut
      });
      $scope.callDrawsvg = function (speed, path) {
        drawsvg(speed, path);
      };
      $scope.callDrawsvg(properties.dl_fut, document.querySelector('.proposed-dl-line path'));
      $scope.callDrawsvg(properties.dl_curr, document.querySelector('.current-dl-line path'));
      $scope.callDrawsvg(properties.ul_fut, document.querySelector('.proposed-ul-line path'));
      $scope.callDrawsvg(properties.ul_curr, document.querySelector('.current-ul-line path'));
    };

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function (ev, leafletEvent) {
      $scope.updateSiteInfo(leafletEvent.target.feature)
    });
    $scope.$on('leafletDirectiveMap.geojsonClick', function (ev, featureSelected, leafletEvent) {
      $scope.updateSiteInfo(featureSelected);
    });


  }]);