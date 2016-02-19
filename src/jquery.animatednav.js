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
	 * $containerElem: context for plugin
 	 *
 	**/
	var animateOut = function( element, $containerElem ){
			
		// get child dropdown menu container
		var $subMenuContainer = $( element ).find(".dropdown-menu");

		// get List items of subMenu List Items
		var $elems = $( element ).find(".dropdown-menu li");

		// get list of top level List Items
		var $mainList = $containerElem.find( "ul.navbar-nav>li" );

		// add animate.css Classes to List Items of Main Menu		
		$mainList.addClass( "animated fadeOut" );
		
		/** 
		 *  better controll of animations 
		 *  using transition/animation envents.
		 *  rather than relying on timers.
		**/
		// triggers when Last Main menu element Ends its animation.
		$mainList.last().one( "animationend webkitAnimationEnd oanimationend MSAnimationEnd", function( e ){ 
			
			// Add class to dropdown menu to change background
			// this covers and hides the main menu elements 
			// AFTER they have faded out.
			$subMenuContainer.addClass( "animating" );

			// Loop  subMenu Elements
			// Attaches animation classes with increasing delay 
			// to stagger element animations.
			$elems.each( function( i ) {

				// cache current element
				var $curEle = $( this );

				// addClass to subMenu LI with the Delay
				// so element display is staggered.
				setTimeout( function(){
					
					$curEle.removeClass( "animated fadeOutLeft" ); //
					$curEle.addClass( "animated fadeInLeft" );

				}, settings.stagger * i );

			}); //-END $elems.each()
	
			// triggers when First sub menu element Starts animating.
			$elems.first().one( "animationstart webkitAnimationStart oanimationstart MSAnimationStart", function( e ){ 
				
				// clean up animation classes
				$mainList.removeClass( "animated fadeOut" );	

				// remove this animation Start event listener
				$elems.first().off( "animationstart webkitAnimationStart oanimationstart MSAnimationStart" );
					
			}); //- END $elems.fist().one( animationstart) event listener.

			// remove this animation end event listener
			$mainList.last().off( "animationend webkitAnimationEnd oanimationend MSAnimationEnd" );
	
		 }); //- END $mainList.last.one( animationend ) event listener.

		
	}; //- END function animateOut()

	/**
	 * function animateIn()
  	 * private function for plugin.
 	 * Animates the SubMenu Out and the Main Menu In
 	 *
	 * Called by hide.bs.dropdown event listener
	 * element: this element of event listener context.
	 * $containerElem: context for plugin
	**/
	var animateIn = function( element, $containerElem ){	
		
		// Get list of menu items that are a dropdown.
		var $dropdownEle = getOpenDropdown( $containerElem );

		// get child dropdown menu container
		var $subMenuContainer = $( element ).find(".dropdown-menu");

		// get list items of dropdown menu to be animated
		var $elems = $( element ).find( ".dropdown-menu li" );

		// get top level menu list items.
		var $mainList = $containerElem.find( "ul.navbar-nav>li" );

		// signal closing of dropdown to hold off bootstraps toggle untill we are ready.
		$( element ).data( 'closing', true ); 

		// Remove any trace of previous animations
		$elems.removeClass( "fadeInLeft" );
		
		// Loop  subMenu Elements
		// Attaches animation classes with increasing delay to stagger element animations.
		$elems.each( function( i, curElement ) {
	
			// cache this element
			var $curEle = $( curElement );
			
			setTimeout( function(){
				$curEle.addClass( "animated fadeOutLeft" );
			}, settings.stagger * i );

		}); //-END $elems.each()
	
		// triggers when last Sub Menu element ends its animation
		$elems.last().one( "animationend webkitAnimationEnd oanimationend MSAnimationEnd", function( e ){ 
			
			// Add class to dropdown menu to change background
			// this covers and hides the main menu elements 
			// AFTER they have faded out.
			$subMenuContainer.removeClass( "animating" );

			$mainList.addClass( "animated fadeIn" );						

			// SET closeable flag, signals to the plugin that
			// the dropdown is now able to be closed.
			$dropdownEle.data( 'closable', true );
			
			// Get dropdown element to Toggle
			var $toggleElem = $containerElem.find( 'ul.nav li.open>[data-toggle="dropdown"]' );	
			
			// trigger toggle on bootstrap dropdown element
			// this cleans up bootstraps element state.
			$toggleElem.dropdown( 'toggle' );

			// reset clsoing state now that the element has been closed.
			$( element ).data( 'closing', false );			

			// triggers when the last Main Menu element ends its animation.
			$mainList.last().one( "animationend webkitAnimationEnd oanimationend MSAnimationEnd", function( e ){ 
				
				// clean up animation classes
				$mainList.removeClass( "animated fadeIn" );
	
				//remove animation end listener.
				$mainList.last().off( "animationend webkitAnimationEnd oanimationend MSAnimationEnd" );

			}); //- END $mainList.last().one( animationend ) event listener )

			// clean up animation classes
			$elems.removeClass( "animated fadeOutLeft" );

			//remove animation end listener.
			$elems.last().off( "animationend webkitAnimationEnd oanimationend MSAnimationEnd" );

		}); //- END $elems.last().one( animationend ) event listener )
		
	}; // - END function animateIn()

	/**
	 * function getOpenDropdown
	 * private function
	 * returns the dropdown list item which
	 * holds the .open class.
	 * keeps element in context
	 * $containerElem: element of plugin context.
	 *
	**/
	var getOpenDropdown = function( $containerElem ){
		
		return  $containerElem.find( "ul.nav li.open" ) ;

	}; //- END function getOpenDropdown()


	var breadcrumbs = function( $containerElem ) {
		
		// Create breadcrumb container element.
		var $breadCrumb  = $( '<ol class="breadcrumb "/>' );
				
		$breadCrumbToggle = $( '<li class="active ">' + settings.bchometext + '</li>' );
		$breadCrumb.append( $breadCrumbToggle );

		// Get all dropdown toggle elements.
        var $toggles = $containerElem.find( "ul.nav li.dropdown .dropdown-toggle" );

		//listen to dropdown-toggle anchors to create breadcrumbs.
		$toggles.click( function(){

			// get text of link to use in breadcrumb
			var linkText = $( this ).text();
			
			$menuToggle = $breadCrumb.find( ".active" );

			$menuToggle.removeClass( "active" );
			$menuToggle.html( '<a href="#" class="toggle-menu ">' + settings.bchometext + '</a>' );

			// Append breadcrumb link
			$breadCrumb.append( '<li class="active animated fadeIn">' + linkText + '</li>' );

		}); // End click ul.nav li.dropdown .dropdown-toggle
				
		
		// Breadcrumb click handler.
		// Show/hide the needed menu based on bredcrumb clicks.
		$breadCrumb.on( 'click', 'a.toggle-menu', function( e ){

			e.preventDefault(); 

			// remove all breadcrumbs following the item clicked.
			$ele = $( this ).parent();
			$ele.nextAll().remove();
			$ele.addClass( "active" );

			$ele.html( settings.bchometext );

			// signal that a breadcrumb has been clicked 
			// this allows the animateIn function call to happen.
			$openDropdown = getOpenDropdown( $containerElem );
			$openDropdown.data( 'breadClick', true );


		}); // - END #breadcrumbContainer on "click" function

		$containerElem.prepend( $breadCrumb );

	}; //- END function breadcrumbs()


	/******************************/
	/***** Private Properties *****/
	/******************************/	

    $.fn.animatedNav = function( options ) {
 

 		// store defaults overridden by options in 
		// settings variable which lives in plugin scope.
		// useable as "settings.color"
		settings = $.extend( {}, $.fn.animatedNav.defaults, options );

 		// avoid confusion with "this" context
 		var $containerElem = $( this );
		
		// breadcrumb functionality
		// ignored if settings.breadcrumb is set to false
		if( settings.breadcrumb === true ) {

			breadcrumbs( $containerElem );			

		} //- END if( settings.breadcrumbs === true )

        // Get list items that are twbs dropdown elements.
        var $dropdowns = $containerElem.find( 'ul.nav .dropdown' );

		// Bootstrap navigation dropdown event handlers
		$dropdowns.on( {

			"hide.bs.dropdown" : function(e) { 
				
				var bcCheck = true;

				// If breadcrumbs are used we only animate out if a breadcrumb is clicked.
				// otherwise animate out on any safe click
				if( settings.breadcrumb === true && getOpenDropdown( $containerElem ).data( 'breadClick' ) !== true) {
					bcCheck = false;
				}

				// Skip animations once the closing event happens.
				// this prevents an overflow loop as the toggle
				// in animateIn trigers the hide.bs.dropdown event again
				if( $( this ).data( 'closing' ) !== true && bcCheck ){
					
					// fire animations sequence.
					animateIn( this, $containerElem );
				}
				
				// re initalize breadcrumb click state
				if( settings.breadcrumb === true ) {
					getOpenDropdown( $containerElem ).data( 'breadClick', false );
				}
				
				// prevent hidding of the dropdown window when closable = false
				return jQuery( this ).data( 'closable' ); 

				
			},
			"show.bs.dropdown": function() { 
				//console.log( "show.bs.dropdown" );

				animateOut( this, $containerElem );
				$( this ).data( 'closable', false ); 
			}
		}); //- END $dropdowns.on

        // return item back for chaining
        return this;
 
    }; // - END animatedNav function()

    // publicly available Plugin Defaults
	$.fn.animatedNav.defaults = {
		stagger: 200,		// delay between indivual LI element animations	
		breadcrumb: false,	// flag to use menu breadcrumbs.
		bchometext: "Main Menu"	// Link text of breadcrumb ( not in use yet. )
	};
 
}( jQuery ));

///  END jQuery Plugin.....

