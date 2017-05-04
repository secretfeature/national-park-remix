class VerticalSlider {
  
  constructor( options ) {

    this.element = document.createElement( "div" );
    this.sliderElement = document.createElement( "div" );
    this.handleElement = document.createElement( "div" );
    this.element.appendChild( this.sliderElement );
    this.element.appendChild( this.handleElement );

    this.minVal = options.minVal || 0;
    this.maxVal = options.maxVal || 0;

    this.range = this.maxVal - this.minVal;

    options.containerElement.appendChild( this.element );

    // capture events
    //capturing the mousedown on the handle

    // adding the slide functionality
    let isSliding = false;

    function addSlide() {
        isSliding = true;
        if ( !window.addEventListener ){
            document.attachEvent('onmousemove',move);
        } else {
            document.addEventListener('mousemove', move, false);
        }
    };

    function cancelBubble( event ) {

        let e = event ? event : window.event;

        if( e.stopPropogation ){

          e.stopPropogation();
        
        }

        if( e.cancelBubble != null ){

          e.cancelBubble = true;
        
        }

        if( e.preventDefault ){

          e.preventDefault();
        
        } else {
        
          e.returnValue = false;
        
        }

    };

    this.handleElement.onmousedown = function(e) {

        addSlide();
        cancelBubble(e);
    
    }

    //capture the mouseup on the handle
    this.handleElement.onmouseup = function(e) {

        cancelSlide();
        cancelBubble(e);
    
    }

    // capture the mouse up on the slider
    this.sliderElement.onmouseup = function( e ) {
    
        cancelSlide();
        cancelBubble(e);
    
    }

    // capture the mouse down on the slider
    this.sliderElement.onmousedown = ( e ) => {

        move( e );
        cancelBubble( e );
    
    }

    this.sliderElement.onmouseuout = this.sliderElement.onmouseup;

    // capture the mouse up on the container
    this.element.onmouseup = function(e) {

        cancelSlide();
        cancelBubble(e);
    
    }

    // capture the mouse down on the container
    this.element.onmousedown = function(e) {
    
        move(e);
        cancelBubble(e);
    
    }

    // capture the mouse up on the window
    document.onmouseup = function(e) {
    
        cancelSlide();
        cancelBubble(e);
    
    }

  }

  move( event ) {

    let
    mouseY = 0,
    top = 0,
    newHeight = 0,
    containerHeight = 0,
    percentHght = 0,
    x = 0,
    y = 0,
    sliderValue = 0;

    if ( !event ) event = window.event;

    top = element.offsetTop;
    newHeight = mouseY - top;
    height = container.offsetHeight;
    percentHeight = newHeight * 100 / containerHeight;

    if( ( percentHeight <= 100 ) && ( percentHeight >= 0 ) ) {
        sliderElement.style.height = ( percentHeight ) + '%';
        y = 100 - percentHeight;
        x = y * range / 100;

    } else if( percentHeight < 0 ) {
        percentHeight = 0;
        sliderElement.style.height = ( percentHeight ) + '%';
        y = 100 - percentHeight;
        x = y * range / 100;

    } else if( percentHeight > 100 ) {
        percentHeight = 100;
        sliderElement.style.height = ( percentHeight ) + '%';
        y = 100 - percentHeight;
        x = y * this.range / 100;
    }

    sliderValue = Math.round( x );
    document.getElementById('sliderValue').innerHTML = sliderValue + this.minVal;
  
  }

   // adding the slide functionality
    var addSlide = function() {
        isSliding = true;
        if ( !window.addEventListener ){
            document.attachEvent('onmousemove',move);
        } else {
            document.addEventListener('mousemove', move, false);
        }
    };

    // removing the slide functionality
    var cancelSlide = function() {
        if( isSliding ) {
            if ( window.removeEventListener ) {
                document.removeEventListener('mousemove', move, false);
            } else if ( window.detachEvent ) {
                document.detachEvent('onmousemove', move );
            }
        }
    };

    // cancelling event bubbling
    // cancelling default event action
    var cancelBubble = function(e) {
        var evt = e ? e:window.event;

        if( evt.stopPropogation ){
            evt.stopPropogation();
        }

        if( evt.cancelBubble != null ){
            evt.cancelBubble = true;
        }

        if( evt.preventDefault ){
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    };

}