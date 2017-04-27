class ADSREnvelope {
    
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.attack = options.attack || 0;
    this.decay = options.decay || 0;
    this.sustain = options.sustain || 0;
    this.release = options.release || 1;

  }

  trigger( time = this.audioContext.currentTime ) {

    this.param.cancelScheduledValues( time );

    this.param.setValueAtTime( this.param.value, time );

    //attack
    this.param.linearRampToValueAtTime( 1.0, time + this.attack );

    //decay
    this.param.linearRampToValueAtTime( this.sustain, time + this.attack + this.decay );

    //release
    this.param.linearRampToValueAtTime( 0.0, time + this.release );

  }

  stop( time = this.audioContext.currentTime ) {

    this.param.cancelScheduledValues( time );

    //release
    this.param.setValueAtTime( this.param.value, time );
    this.param.linearRampToValueAtTime( 0.0, time + this.release );

  }

  connect( param ) {

    this.param = param;

  }

  disconnect() {

    this.param.cancelScheduledValues( this.audioContext.currentTime );

  }

}