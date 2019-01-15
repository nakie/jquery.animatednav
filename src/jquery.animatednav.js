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
	var animateOut = function( element ){
		
		// get List items of subMenu
		var $elems = $( element ).find(".dropdown-menu li");
		
		// add animate.css Classes to List Items of Main Menu
		var $main = $( "ul.navbar-nav>li" ).addClass( "animated fadeOut" );

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
				$( "ul.navbar-nav>li" ).removeClass( "animated fadeOut" );				
		}, 500 );

	}; //- END function animateOut()

	// animate the main menu back in from a submenu.
	var animateIn = function( element ){

		$( element ).data( 'closing', true ); 

		$dropdownEle = $( 'ul.nav li.open' );

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
		
		setTimeout( function(){
            
			//jQuery( "ul.navbar-nav>li" ).removeClass( "animated fadeIn" );
			$main = $( "ul.navbar-nav>li" ).addClass( "animated fadeIn" );
			//console.log( "Fade In" );

			var $toggleElem = $( 'ul.nav li.open>[data-toggle="dropdown"]' );				
			
			$dropdownEle.data( 'closable', true );
			$toggleElem.dropdown( 'toggle' );\
			$( element ).data( 'closing', false );

		}, $elems.length * 200 );

		setTimeout( function(){
				$( "ul.navbar-nav>li" ).removeClass( "animated fadeIn" );
				
		}, $elems.length * 500 );

		// Signal that closing is now done.
		//jQuery( element ).data( 'closing', false ); 

	}; // - END function animateIn()


    /******************************/
    /***** Public Properties ******/
    /******************************/	
    $.fn.animatedNav = function( options ) {
 
 		// just to avoid confusion with "this" context
 		var plugin = this;

        // store defaults overridden by options in 
        // settings variable which lives in plugin scope.
	    // useable as "settings.color"
        settings = $.extend({}, $.fn.animatedNav.defaults, options );
 
		// // array of Dropdown List Items
		// var navArray = [];

		// // populating array of drop downs from Anchor tag text
		// $( 'ul.nav li .dropdown-toggle' ).each( function() {
		// 	navArray.push( $( this ).text() );
		// });


		// Click function on dropdown-toggle anchors to create breadcrumbs.
		$( "ul.nav li.dropdown .dropdown-toggle" ).click( function(){

			//var linkText = $( this ).find(".dropdown-toggle").text();
			var linkText = $( this ).text();
			//console.log( linkText );
			//.....//
			// add code to insert new breadcrumb //
			var breadcrumbContainer = $( '#breadcrumbContainer' );

			breadcrumbContainer.append( "<a>" + linkText + "</a>" );

		}); // End click ul.nav li.dropdown .dropdown-toggle

		// Breadcrumb click handler.
		// Show/hide the needed menu based on bredcrumb clicks.
		$( '#breadcrumbContainer' ).on( 'click', 'a.toggle-menu', function( e ){

			e.preventDefault();
			$ele = $( this );
			$ele.nextAll().remove();

			$( 'ul.nav li.open' ).data( 'breadClick', true );

		}); // - END #breadcrumbContainer on "click" function

		// Bootstrap navigation dropdown event handlers
		$( 'ul.nav .dropdown' ).on( {

			"hide.bs.dropdown" : function(e) { 
				
				var bcCheck = true;

 				//console.log( "hide.bs.dropdown" );					
				//console.log( "closable: " + $( this ).data( 'closable' ) + " | closing: " +  $( this ).data( 'closing') );

				if( settings.breadcrumb === true && $( 'ul.nav li.open' ).data( 'breadClick' ) !== true) {
					bcCheck = false;
				}
				//console.log( "Getting Closing: " + jQuery( this ).data( 'closing') );	

				if( $( this ).data( 'closing') !== true && bcCheck ){
					console.log( "animateIn Called" );
					animateIn( this );
				}
						
				$( 'ul.nav li.open' ).data( 'breadClick', false );
				// prevent hidding of the dropdown window when closable = false
				return jQuery( this ).data( 'closable' ); 
                
			},
			"hidden.bs.dropdown" : function() { 
				//console.log( "hidden.bs.dropdown" );
			},
			"show.bs.dropdown": function() { 
				
                //console.log( "show.bs.dropdown" );
				animateOut( this );
			},
			"shown.bs.dropdown": function() { 

 				//console.log( "shown.bs.dropdown" );
				// Initalize closable to false when the dropdown is shown
				$( this ).data( 'closable', false ); 
		
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



			

			


	

			
			

			

	


	

	
