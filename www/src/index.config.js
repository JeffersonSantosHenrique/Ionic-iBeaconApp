(function(){
	'use strict';

	angular.module('iBeaconApp')
		   .config(ConfigFunction);

	ConfigFunction.$inject = [
		'CONFIG',
		'$httpProvider'
	];

	function ConfigFunction(
		CONFIG, 
		$httpProvider
	){

		// $httpProvider.interceptors.push('HttpInterceptorFactory');	

	}

})();