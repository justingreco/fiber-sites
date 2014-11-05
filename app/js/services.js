'use strict';
/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory('drawsvg', [function () {
  	//Code taken from the following blog:
  	//http://jakearchibald.com/2013/animated-line-drawing-svg/
  	return function (speed, path) {
  		path.style.display = 'block';
		var length = path.getTotalLength();
		// Clear any previous transition
		path.style.transition = path.style.WebkitTransition =
		  'none';
		// Set up the starting positions
		path.style.strokeDasharray = length + ' ' + length;
		path.style.strokeDashoffset = length;
		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		path.getBoundingClientRect();
		// Define our transition
		var time = 1000/speed;
		if (speed === 0) {
			time = 0;
			path.style.display = 'none';
		}
		path.style.transition = path.style.WebkitTransition =
		  'stroke-dashoffset '+time+'s ease-in-out';
		// Go!
		path.style.strokeDashoffset = '0';
  	}
  }]);
