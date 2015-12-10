( function ( $ ) {

	/******************************/
	/***** Private Properties *****/
	/******************************/

	var settings = {};

	/**
 	 * Function: animateOut
 	 * private function for plugin.
 	 * Animates the Main menu Out and the SubMenu In
 	 *
	 * Called by show.bs.dropdown event listener
	 * element: this element of event listener context.
 	 *
 	**/
	var animateOut = function( element, $containerElem ){
		
		// get List items of subMenu
		var $elems = $( element ).find(".dropdown-menu li");

		
		// add animate.css Classes to List Items of Main Menu
		//var $main = $( "ul.navbar-nav>li" ).addClass( "animated fadeOut" );

		var $mainList = $containerElem.find( "ul.navbar-nav>li" );
		$mainList.addClass( "animated fadeOut" );

		// Remove any trace of previous animations
		$elems.removeClass( "animated fadeOutLeft" ); //***

		// Loop  subMenu Elements
		// Attaches animation classes with increasing delay 
		// to stagger element animations.
		$elems.each( function( i ) {
			var $curEle = $( this );

			// addClass ot subMenu LI with Delay
			setTimeout( function(){
				//$curEle.removeClass( "fadeOutLeft" ); //***
				$curEle.addClass( "animated fadeInLeft" );
				//console.log( this );
			}, 100 * i );
		}); //-END $elems.each()

		setTimeout( function(){
				$mainList.removeClass( "animated fadeOut" );				
		}, 500 );

	}; //- END function animateOut()

	// animate the main menu back in from a submenu.
	var animateIn = function( element, $containerElem ){

		$( element ).data( 'closing', true ); 

		// $dropdownEle = $( 'ul.nav li.open' );
		$dropdownEle = getOpenDropdown( $containerElem );

		var $elems = $( element ).find( ".dropdown-menu li" );

		//$elems.removeClass( "fadeInLeft" );

		$elems.removeClass( "fadeInLeft" ); //***

		$elems.each( function( i, curElement ) {
			var $curEle = $( curElement );
			
			//$curEle.removeClass( "fadeInLeft" );
			setTimeout( function(){
				$curEle.addClass( "animated fadeOutLeft" );
			}, 100 * i );

		}); //-END $elems.each()

		
		var $mainList = $containerElem.find( "ul.navbar-nav>li" );

		setTimeout( function(){
//			jQuery( "ul.navbar-nav>li" ).removeClass( "animated fadeIn" );
			$mainList.addClass( "animated fadeIn" );
			//console.log( "Fade In" );

			// var $toggleElem = $( 'ul.nav li.open>[data-toggle="dropdown"]' );				
			var $toggleElem = $containerElem.find( 'ul.nav li.open>[data-toggle="dropdown"]' );				
			
			$dropdownEle.data( 'closable', true );
			

			$toggleElem.dropdown( 'toggle' );

			$( element ).data( 'closing', false );

		}, $elems.length * 200 );

		setTimeout( function(){
				$mainList.removeClass( "animated fadeIn" );
				
		}, $elems.length * 500 );

		// Signal that closing is now done.
		//jQuery( element ).data( 'closing', false ); 

	}; // - END function animateIn()

	var getOpenDropdown = function( $containerElem ){
		
		return  $containerElem.find( "ul.nav li.open" ) ;

	} //- END function getOpenDropdown()


	/******************************/
	/***** Private Properties *****/
	/******************************/

	

    $.fn.animatedNav = function( options ) {
 

 		// store defaults overridden by options in 
		// settings variable which lives in plugin scope.
		// useable as "settings.color"
		settings = $.extend({}, $.fn.animatedNav.defaults, options );

 		// just to avoid confusion with "this" context
 		var $containerElem = $( this );

       
        var $toggles = $containerElem.find( "ul.nav li.dropdown .dropdown-toggle" );

 
		// // array of Dropdown List Items
		// var navArray = [];

		// // populating array of drop downs from Anchor tag text
		// $( 'ul.nav li .dropdown-toggle' ).each( function() {
		// 	navArray.push( $( this ).text() );
		// });


		// Click function on dropdown-toggle anchors to create breadcrumbs.
		$toggles.click( function(){

			//var linkText = $( this ).find(".dropdown-toggle").text();
			var linkText = $( this ).text();
			//console.log( linkText );
			//.....//
			// add code to insert new breadcrumb //
			var breadcrumbContainer = $( '#breadcrumbContainer' );

			breadcrumbContainer.append( "<a>" + linkText + "</a>" );

		}); // End click ul.nav li.dropdown .dropdown-toggle

		

		if( settings.breadcrumb === true ) {

			var $breadCrumb = $containerElem.find( '#breadcrumbContainer'  );
		
			// Breadcrumb click handler.
			// Show/hide the needed menu based on bredcrumb clicks.
			$breadCrumb.on( 'click', 'a.toggle-menu', function( e ){

				e.preventDefault();

				$ele = $( this );
				$ele.nextAll().remove();

				//$( 'ul.nav li.open' ).data( 'breadClick', true );

				//$openDropdown1 = $containerElem.find( "ul.nav li.open" );
				//$openDropdown.data( 'breadClick', true );

				$openDropdown = getOpenDropdown( $containerElem );
				$openDropdown.data( 'breadClick', true );

				console.log( $openDropdown );
				//console.log( $openDropdown1 );

			}); // - END #breadcrumbContainer on "click" function

		}


		var $dropdowns = $containerElem.find( 'ul.nav .dropdown' );
		// Bootstrap navigation dropdown event handlers

		$dropdowns.on( {

			"hide.bs.dropdown" : function(e) { 
				
				var bcCheck = true;

				console.log( "hide.bs.dropdown" );					

				console.log( "closable: " + $( this ).data( 'closable' ) + " | closing: " +  $( this ).data( 'closing') );

				console.log( getOpenDropdown( $containerElem ) );
				console.log( getOpenDropdown( $containerElem ).data( 'breadClick' ) );
				//if( settings.breadcrumb === true && $( 'ul.nav li.open' ).data( 'breadClick' ) !== true) {
				if( settings.breadcrumb === true && getOpenDropdown( $containerElem ).data( 'breadClick' ) !== true) {
					bcCheck = false;
				}
				//console.log( "Getting Closing: " + jQuery( this ).data( 'closing') );	

				if( $( this ).data( 'closing') !== true && bcCheck ){
					console.log( "animateIn Called" );
					animateIn( this, $containerElem );
				}
				
				
				getOpenDropdown( $containerElem ).data( 'breadClick', false );
				// prevent hidding of the dropdown window when closable = false
				return jQuery( this ).data( 'closable' ); 

				
			},
			"hidden.bs.dropdown" : function() { 
				console.log( "hidden.bs.dropdown" );
			},
			"show.bs.dropdown": function() { 
				console.log( "show.bs.dropdown" );

				animateOut( this, $containerElem );
				$( this ).data( 'closable', false ); 
			},
			"shown.bs.dropdown": function() { 

				console.log( "shown.bs.dropdown" );

				// Initalize closable to false when the dropdown is shown
				//$( this ).data( 'closable', false ); 
				// moved to show.bs.dropdown so the whole shown.bs.dropdown
				// can be removed hopefully.
		
			}
		});


        // Greenify the collection based on the settings variable.
        return this;
 
    }; // - END animatedNav function()

    // publicly available Plugin Defaults
	$.fn.animatedNav.defaults = {
		staggerDelay: 200,
		breadcrumb: true,
		bchometext: "main"
	};

 
}( jQuery ));




///  END jQuery Plugin.....



			

			


	

			
			

			

	


	

	