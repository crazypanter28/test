( function(){
	'use strict';

	function goalsCtrl( userConfig ){
		var vm = this,
			initDate = moment().businessSubtract( 1 );

		function setup(){

			// User info
	        vm.sadviser = userConfig.user;

	        // Datepicker options
	        vm.datepicker_opts = {
	        	parentEl: ".goals-page",
	        	singleDatePicker: true,
	        	initDate: new Date( initDate ),
	            isInvalidDate: function( date ){
	                return ( date.day() === 0 || date.day() === 6 ) ? true : false;
	            },
	            maxDate: initDate.format( 'DD/MM/YY' )
	        };

    	}

    	// Init
    	setup();
	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'goalsCtrl', goalsCtrl );

})();