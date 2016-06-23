
(function(){
	'use strict';

	angular.module('iBeaconApp')
		   .controller('HomeController', HomeController);

	HomeController.$inject = [
		'$ionicPlatform',
		'$log',
		'$state',
		'$ionicPopup',
		'$rootScope',
		'$scope',
		'$cordovaBeacon',
		'$cordovaLocalNotification',
		'$cordovaInAppBrowser'
	];

	function HomeController(
		$ionicPlatform,
		$log,
		$state,
		$ionicPopup,
		$rootScope,
		$scope,
		$cordovaBeacon,
		$cordovaLocalNotification,
		$cordovaInAppBrowser
	){
		
		var vm = this;

		var brIdentifier = 'estimote';
		var brUuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';		
		var brMajor = null;
		var brMinor = null;
		var brNotifyEntryStateOnDisplay = true;		

		$scope.beacons = {};

		$scope.monitoringForRegion = { checked: false };
		
		//FUNCTIONS
		function _init(){				
			
    		$scope.didChangeAuthorizationStatusLog = '';
			$scope.didStartMonitoringForRegionLog = '';
			$scope.didDetermineStateForRegionLog = '';
			$scope.peripheralManagerDidStartAdvertisingLog = '';
			$scope.peripheralManagerDidUpdateStateLog = '';
			$scope.didRangeBeaconsInRegionLog = '';

    		if ($rootScope.isIOS) {


				// $cordovaBeacon.isBluetoothEnabled().then(function(isEnabled){

					// if (!isEnabled) {

						$cordovaLocalNotification.hasPermission().then(function(granted) {
							
							if (granted) {

								console.log('## Platform iOS');


								$cordovaBeacon.getAuthorizationStatus().then(function(status){

									$cordovaBeacon.requestAlwaysAuthorization();

									// var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(brIdentifier, brUuid, brMajor, brMinor);
									var beaconRegion = $cordovaBeacon.createBeaconRegion(brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay);

									$cordovaBeacon.isAdvertising().then(function(isAdvertising){

										console.log('isAdvertising: ' + isAdvertising);

										if (isAdvertising) {

											$cordovaBeacon.startAdvertising(beaconRegion).then(function(){

												console.log("Advertising not supported");

								            }).error(function(err){
												console.error(err);
								            });

										}

										
									});

								});								
								
							}

						});

					// }

				// }).error(function(e) { 
				// 	console.error(e); 
				// });

			} else {

				console.log('## Platform Android');	

				$cordovaBeacon.isBluetoothEnabled().then(function(isEnabled){
			        
			        console.log('isEnabled: ' + isEnabled);
			        
			        if (!isEnabled) {			            
			            $cordovaBeacon.enableBluetooth().then(function(){
			            	console.log('Bluetooth: enabled');
			            });        
			        }

			    }).error(function(e) { 
					console.error(e); 
				});

			}

		}

		$scope.requestAlwaysAuthorization = function() {
	      	$cordovaBeacon.requestAlwaysAuthorization();
	    };	  	    

	    $scope.clearLogs = function() {

	      	$scope.didChangeAuthorizationStatusLog = '';
			$scope.didStartMonitoringForRegionLog = '';
			$scope.didDetermineStateForRegionLog = '';
			$scope.peripheralManagerDidStartAdvertisingLog = '';
			$scope.peripheralManagerDidUpdateStateLog = '';
			$scope.didRangeBeaconsInRegionLog = '';

	      	$scope.beacons = {};

	    };

	    $scope.onChangeMonitoringForRegion = function() {
		    
		    var beaconRegion = $cordovaBeacon.createBeaconRegion(brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay);

		    if ($scope.monitoringForRegion.checked) {

		    	$cordovaBeacon.startMonitoringForRegion(beaconRegion);
		      	$cordovaBeacon.startRangingBeaconsInRegion(beaconRegion);

		    } else {

		    	$cordovaBeacon.stopMonitoringForRegion(beaconRegion);
				$cordovaBeacon.stopRangingBeaconsInRegion(beaconRegion);

		    }

		};		

		$ionicPlatform.ready(function() {

			_init();

		});

		//METHODS OF BROADCAST
		$rootScope.$on('$cordovaBeacon:didChangeAuthorizationStatus', function (event, pluginResult) {
	      	
	      	$scope.didChangeAuthorizationStatusLog += '-----' + '\n';
	      	$scope.didChangeAuthorizationStatusLog += JSON.stringify(pluginResult) + '\n';

	      	switch (pluginResult) {
			    case 'AuthorizationStatusNotDetermined':
			        $cordovaBeacon.requestAlwaysAuthorization();
			        break
			    case 'AuthorizedWhenInUse':
			        $cordovaBeacon.startUpdatingLocation();
			        break
			    case 'AuthorizedAlways':
			        $cordovaBeacon.startUpdatingLocation()
			        break
			    case 'Restricted':
			        // restricted by e.g. parental controls. User can't enable Location Services
			        break
			    case 'Denied':
			        // user denied your app access to Location Services, but can grant access from Settings.app
			        break
			    default:
			        break;
			}

	    });

		$rootScope.$on('$cordovaBeacon:didStartMonitoringForRegion', function (event, pluginResult) {
	      	
	      	$scope.didStartMonitoringForRegionLog += '-----' + '\n';
	      	$scope.didStartMonitoringForRegionLog += JSON.stringify(pluginResult) + '\n';

	    });

	    $rootScope.$on('$cordovaBeacon:didDetermineStateForRegion', function (event, pluginResult) {
	      	
	      	$scope.didDetermineStateForRegionLog += '-----' + '\n';
	      	$scope.didDetermineStateForRegionLog += JSON.stringify(pluginResult) + '\n';
			
			// if (pluginResult.region.identifier == brIdentifier && pluginResult.region.typeName == 'BeaconRegion' && pluginResult.state == 'CLRegionStateInside') {
				
			// 	var notification = {
			// 		id: 99990,
			// 		title: 'Aviso!',
			// 		text: 'Você entrou na region do Beacon',				
			// 		autoCancel: true,
			// 		data: { beacon: 'alternate' } 
			// 	};
				
			// 	sendNotification(notification);     		

   //          } else if (pluginResult.region.identifier == brIdentifier && pluginResult.region.typeName == 'BeaconRegion' && pluginResult.state == 'CLRegionStateOutside') {

			// 	var notification = {
			// 		id: 99991,
			// 		title: 'Aviso!',
			// 		text: 'Você saiu da region do Beacon',				
			// 		autoCancel: true,
			// 		data: { beacon: 'alternate' } 
			// 	}; 

			// 	sendNotification(notification);     		
   //          }


	    });


	    $rootScope.$on('$cordovaBeacon:didEnterRegion', function (event, pluginResult) {

    		$cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
	        	brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
	      	));

   //    		var notification = {
			// 	id: 99990,
			// 	title: 'Aviso!',
			// 	text: 'Você entrou na region do Beacon',				
			// 	autoCancel: true,
			// 	data: { beacon: 'alternate' } 
			// }; 

			// sendNotification(notification);     	

	    });

	    $rootScope.$on('$cordovaBeacon:didExitRegion', function (event, pluginResult) {

	    	$cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
	        	brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
	      	));

	  //     	var notification = {
			// 	id: 99991,
			// 	title: 'Aviso!',
			// 	text: 'Você saiu da region do Beacon',				
			// 	autoCancel: true,
			// 	data: { beacon: 'alternate' } 
			// }; 

			// sendNotification(notification);  
	    	
	    });

	    $rootScope.$on('$cordovaBeacon:peripheralManagerDidStartAdvertising', function (event, pluginResult) {
	    	
	    	$scope.peripheralManagerDidStartAdvertisingLog += '-----' + '\n';
	      	$scope.peripheralManagerDidStartAdvertisingLog += JSON.stringify(pluginResult) + '\n';

	    });

	    $rootScope.$on('$cordovaBeacon:peripheralManagerDidUpdateState', function (event, pluginResult) {
	    
	    	$scope.peripheralManagerDidUpdateStateLog += '-----' + '\n';
	      	$scope.peripheralManagerDidUpdateStateLog += JSON.stringify(pluginResult) + '\n';

	    });	   	    

	    $rootScope.$on('$cordovaBeacon:didRangeBeaconsInRegion', function (event, pluginResult) {
	      	
	      	$scope.didRangeBeaconsInRegionLog += '-----' + '\n';
	      	$scope.didRangeBeaconsInRegionLog += JSON.stringify(pluginResult) + '\n';

	      	var uniqueBeaconKey;
            for (var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];


				// Far, Near, and Immediate
                if (pluginResult.beacons[i].uuid.toUpperCase() == brUuid && pluginResult.beacons[i].proximity == 'ProximityImmediate'){

                	$cordovaInAppBrowser.open('http://www.fagrontechnologies.com.br/pt/produtos/mobypharma', '_system');

                }

                	


            }
            $scope.$apply();

	    });		

	    var sendNotification = function(notification) {
			
			try {

				$cordovaLocalNotification.schedule(notification).then(function(result) {
					$log.log('## LOCAL NOTIFICATION AGENDADO COM SUCESSO:  ', result);	
				}, function(err) {
					$log.error('## NAO FOI POSSIVEL AGENDAR LOCAL NOTIFICATION');	
				});
				
			} catch(e) {				
				$log.error('## NAO FOI POSSIVEL AGENDAR LOCAL NOTIFICATION: ', e);	
			}	

		}; 

	}

})();