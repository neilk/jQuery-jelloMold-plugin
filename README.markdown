jQuery jelloMold plugin
-----------------------

A workaround to implement CSS min-width and max-width for Internet Explorer 5.5 and Internet Explorer 6.


### Description ###

Does something similar to thee CSS properties min-width and max-width, but by creating several child divs with 
complicated properties. Should work in IE 5.5 and IE 6. If minimum and maximum widths are essential for you, 
and you care about these browsers, this is the module for you.  Otherwise, just use a min-width or max-width CSS rule.

Name and code inspired by the [jelloMold][] described by Mike Purvis. 

  [jelloMold]: http://www.positioniseverything.net/articles/jelloMold-expo.html

### Synopsis ###

    $j( '#contents' ).jelloMold( { align: 'left', minWidth: '32em', maxWidth: '64em' } );
		     .append( '<h1>Hello World. This is a very long headline which shouldn't be shrunk more thatn 32em</h1>' ); 

### Caveats ###

Unlike other jQuery modules, this returns certain newly-created children instead of the original selected elements.
Otherwise, we'd have to wrap the original selector in parent divs, and a typical use case of this module is to
be applied to body, which has no parents.


License
-------
Copyright Neil Kandalgaonkar, 2010

This work is licensed under the terms of the GNU General Public License, 
version 2 or later. 
(see http://www.fsf.org/licensing/licenses/gpl.html). 
Derivative works and later versions of the code must be free software 
licensed under the same or a compatible license.


