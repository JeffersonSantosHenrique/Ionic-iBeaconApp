(function(){
  	'use strict';

	angular.module('iBeaconApp')
	.run(RunFunction);

	RunFunction.$inject = [
		'$rootScope',
		'$cordovaBeacon'
	];
     
    function RunFunction(
    	$rootScope,
    	$cordovaBeacon
    ){

    	$rootScope.isAndroid = ionic.Platform.isAndroid();
    	$rootScope.isIOS = ionic.Platform.isIOS();

    }

})();