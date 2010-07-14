/**
 * jQuery jelloMold plugin
 * Copyright Neil Kandalgaonkar, 2010
 * 
 * This work is licensed under the terms of the GNU General Public License, 
 * version 2 or later. 
 * (see http://www.fsf.org/licensing/licenses/gpl.html). 
 * Derivative works and later versions of the code must be free software 
 * licensed under the same or a compatible license.
 *
 *
 * DESCRIPTION
 *
 * Create a div which will flex with browser window size and text size, but with minimum and maximum widths.
 * Does exactly the same thing as the CSS properties min-width and max-width, but works in IE 5.5 and IE 6.
 * If minimum and maximum widths are essential for you, and you care about these browsers, this is the module for you. 
 * Otherwise, just use a min-width or max-width CSS rule.
 *
 * Based on http://www.positioniseverything.net/articles/jelloMold-expo.html by Mike Purvis.
 *
 * Unlike other jQuery modules, this returns certain children instead of the original selected elements.
 * Otherwise, we'd have to wrap the original selector in parent divs, and a typical use case of this module is to
 * be applied to body, which has no parents.
 *
 * SYNOPSIS
 *
 *   $j( '#contents' ).jelloMold( { align: 'left', minWidth: '32em', maxWidth: '64em' } );
 *   		      .append( '<h1>Hello World. This is a very long headline which shouldn't be shrunk more thatn 32em</h1>' ); 
 *
 */

( function( $j ) { 

	// used by parseMeasure
	var measureRegex = /(\d+(?:\.\d+)?)(px|em)?/;

	/**
	 * Interpret a given string or number as a CSS measure. 
	 * Numeric arguments are interpreted to be in pixels. 
	 * String arguments like "50" are interpreted to be in pixels.
	 * String arguments like "50em" or "500px" are also allowed, with the unit set appropriately.
	 * May throw exception if cannot parse measure.
	 *
	 * @param the measurement
	 * @return an object with a floating point 'val' property, and a string 'unit' property which is either "em" or "px"
	 */
	function parseMeasure( x ) {
		var ret = { unit: 'px' };
		if ( typeof x === 'number' ) {
			ret.val = x;
		} else {
			var matches = x.match( measureRegex );
			if ( matches === null ) {
				throw( new Error( "jelloMold cannot parse measurement: " + x ) );
			} else {
				ret.val = parseFloat( matches[1] );
				if ( matches[2] ) {
					ret.unit = matches[2];
				}
			}
		}
		return ret;
	}


	/**
 	 * Takes a jQuery selector and returns another selector of divs created within that selector which have 
	 * the desired maximum and minimum width properties, regardless of browser window size. 
	 *
	 * @param options  an object containing potentially align, minWidth, maxWidth and outerWidth
	 * @return child divs to which you can now put content into, that will flex according to options 
	 */
	$j.fn.jelloMold = function( options ) {

		var defaults = { align: 'center', minWidth: '320px' };

		var args = $j.extend( defaults, options );
		
		var minObj = parseMeasure( args.minWidth );  
		var unit = minObj.unit; 

		var min = minObj.val;
		var minWidth = min.toString() + unit;
		var halfMinWidth = ( min / 2 ).toString() + unit;
		var negativeHalfMinWidth = ( -1 * min / 2 ).toString() + unit;

		/* outer (applied to body in original jelloMold) */
		var current = this.empty().css( { 
			'padding-top': '0',
			'padding-bottom': '0',
			'padding-left': halfMinWidth,
			'padding-right': halfMinWidth,
			'zoom': 1,
			'text-align': args.align 
		} );

		if ( args.maxWidth ) {
			if ( typeof args.outerWidth === 'undefined' ) {
				args.outerWidth = args.maxWidth;
			}

			var maxObj = parseMeasure( args.maxWidth );
			var outerObj = parseMeasure( args.outerWidth );
			if (minObj.unit != maxObj.unit || maxObj.unit != outerObj.unit ) {
				throw ( new Error( "inconsistent measurement units in parameters to jelloMold()" ) );
			}

			var max = maxObj.val;
			var outer = outerObj.val;
			var maxMinDiffWidth = ( max - min ).toString() + unit;
			var sizerWidthPercent = parseInt( 100 * ( max - min ) / ( outer - min ), 10 ).toString() + '%'; 
			
			var horizontalMargin = '0';
			if ( args.align == 'center' ) {
				horizontalMargin = 'auto';
			}
				

			current.append( 
				$j( '<div class="jelloMoldSizer"/>' ).css( { 
					'width' : sizerWidthPercent,
					'margin-top': '0',
					'margin-bottom': '0',
					'margin-left':  horizontalMargin,
					'margin-right': horizontalMargin,
					'text-align': 'left',
					'max-width': maxMinDiffWidth
				} )
			);

			current = this.find( '.jelloMoldSizer' );

			if ( unit == 'px' && $j.browser.msie && navigator.platform.indexOf('Mac') == -1 ) {
				current.css( 'width', 'expression(document.body.clientWidth > ' + outer + ' ? ' + maxMinDiffWidth + ': "100%")' ); 
			}
		}

		current.append(
			$j( '<div class="jelloMoldExpander"/>' ).css( { 
				'position': 'relative', 
				'zoom': '1',
				'margin-top': '0',
				'margin-bottom': '0',
				'margin-left': negativeHalfMinWidth,
				'margin-right': negativeHalfMinWidth,
				'min-width': minWidth,
				'text-align': 'left'
			 } ).append(
				$j( '<div class="jelloMoldFixer"/>' ).css( { 'width': '100%' } )
			)
		);

		return current.find( '.jelloMoldFixer' );

	}

} )( jQuery );
