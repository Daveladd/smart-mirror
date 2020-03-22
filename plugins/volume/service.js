(function () {
	'use strict';

	
	function VolumeService($interval) {
		var service = {};
		var gaugeCmd=require('node-cmd');
		service.Value = 100;

    
    		  service.getValue = function() {
      			service.Value = Math.floor(Math.random() * 100);
			return service.Value;
      			console.log(service.Value);
      		};

		service.run = function() {
			$interval(function(){ service.getValue; }, 3000);
			return service.Value;
		};
		
		return service;
	}
angular.module('SmartMirror')
.factory('VolumeService', VolumeService);
} ());
