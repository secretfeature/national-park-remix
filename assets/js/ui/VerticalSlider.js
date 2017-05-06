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

    this.handleElement.onmousedown = function(e) {

        addSlide();
        cancelBubble(e);
    
    };

    //capture the mouseup on the handle
    this.handleElement.onmouseup = function(e) {

        cancelSlide();
        cancelBubble(e);
    
    };

    // capture the mouse up on the slider
    this.sliderElement.onmouseup = function( e ) {
    
        cancelSlide();
        cancelBubble(e);
    
    };

    // capture the mouse down on the slider
    this.sliderElement.onmousedown = ( e ) => {

        move( e );
        cancelBubble( e );
    
    };

    this.sliderElement.onmouseuout = this.sliderElement.onmouseup;

    // capture the mouse up on the container
    this.element.onmouseup = function(e) {

        cancelSlide();
        cancelBubble(e);
    
    };

    // capture the mouse down on the container
    this.element.onmousedown = function(e) {
    
        move(e);
        cancelBubble(e);
    
    };

    // capture the mouse up on the window
    document.onmouseup = function(e) {
    
        cancelSlide();
        cancelBubble(e);
    
    };

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

      this.sliderElement.style.height = ( percentHeight ) + '%';
      y = 100 - percentHeight;
      x = y * range / 100;

    } else if( percentHeight < 0 ) {
    
      percentHeight = 0;
      this.sliderElement.style.height = ( percentHeight ) + '%';
      y = 100 - percentHeight;
      x = y * range / 100;

    } else if( percentHeight > 100 ) {
    
      percentHeight = 100;
      this.sliderElement.style.height = ( percentHeight ) + '%';
      y = 100 - percentHeight;
      x = y * this.range / 100;

    }

    sliderValue = Math.round( x );
    document.getElementById( "sliderValue" ).innerHTML = sliderValue + this.minVal;
  
  }

}