'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MapController', ['$scope', '$http', 'leafletData', 'drawsvg', function($scope, $http, leafletData, drawsvg) {
    angular.extend($scope, {
      raleigh: {
        lat: 35.79,
        lng: -78.6436,
        zoom: 10
      },
      tiles: {
        url: 'http://a.tiles.mapbox.com/v3/examples.3hqcl3di/{z}/{x}/{y}.png'
      },
      showInfo: false,
      sites: []
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
                      $scope.sites.push(feature.properties.site);
                      return new L.marker(latlng, {icon: L.icon({iconUrl:iconUrl, iconRetina:iconRetinaUrl})});
                  
                }
            }
        });
    });

    $scope.siteSelected = function () {
      $scope.updateSiteInfo($scope.selectedSite);
      leafletData.getMap().then(function(map) {
          map.setView($scope.selectedSite.geometry.coordinates.reverse(), 16);
      });
    };

    $scope.updateSiteInfo = function (feature) {
      $scope.selectedSite = feature;
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
      raleighCost: 570,
      raleigh_ul: 1000,
      raleigh_dl: 1000,
      raleighSrc: "img/raleigh.png",
      showInfo: true
      });
      $scope.callDrawsvg = function (speed, path) {
        drawsvg(speed, path);
      };
      $scope.callDrawsvg(properties.dl_fut, document.querySelector('.proposed-dl-line path'));
      $scope.callDrawsvg(properties.dl_curr, document.querySelector('.current-dl-line path'));
      $scope.callDrawsvg(properties.ul_fut, document.querySelector('.proposed-ul-line path'));
      $scope.callDrawsvg(properties.ul_curr, document.querySelector('.current-ul-line path'));
      $scope.callDrawsvg(1000, document.querySelector('.raleigh-dl-line path'));
      $scope.callDrawsvg(1000, document.querySelector('.raleigh-ul-line path'));
    };

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function (ev, leafletEvent) {
      $scope.updateSiteInfo(leafletEvent.target.feature)
    });
    $scope.$on('leafletDirectiveMap.geojsonClick', function (ev, featureSelected, leafletEvent) {
      $scope.updateSiteInfo(featureSelected);
    });


  }]);