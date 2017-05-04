class ADSREnvelope {
    
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.attack = options.attack || 0;
    this.decay = options.decay || 0;
    this.sustain = options.sustain || 0;
    this.release = options.release || 1;

    this.paramMap = new Map();

  }

  trigger( time = this.audioContext.currentTime ) {


    // console.log( this.param.value )

    this.paramMap.forEach( ( param ) => {

      //pin value
      // param.cancelAndHoldAtTime( time );

      param.cancelScheduledValues( time );

      param.setValueAtTime( 0, time );

      //attack
      param.linearRampToValueAtTime( 1.0, time + this.attack );

      //decay
      param.exponentialRampToValueAtTime( this.sustain, time + this.attack + this.decay );

      //release
      param.linearRampToValueAtTime( 0.0, time + this.attack + this.decay + this.release );

    } );

    

  }

  stop( time = this.audioContext.currentTime ) {

    // this.param.cancelScheduledValues( time );

    this.paramMap.forEach( ( param ) => {

      //release
      // param.cancelAndHoldAtTime( param.value, time );

      param.setValueAtTime( 0, time );
      param.linearRampToValueAtTime( 0.0, time + this.release );

    } );

  }

  connect( param ) {

    this.paramMap.set( this.paramMap.size, param );

  }

  disconnect( param ) {

    param.cancelScheduledValues( this.audioContext.currentTime );

  }

}