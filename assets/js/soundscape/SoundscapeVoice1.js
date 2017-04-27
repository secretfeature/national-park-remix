class SoundscapeVoice1 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;

    this.envelope = new ADSREnvelope( { 
      audioContext: options.audioContext,
      attack: 3,
      decay: 2,
      sustain: .35,
      release: 10
    } );

    this.filterEnvelope = new ADSREnvelope( { 
      audioContext: options.audioContext,
      attack:  .5,
      decay: 0,
      sustain: 800,
      release: 7
    } );

    this.filter = this.audioContext.createBiquadFilter();
    this.filter.Q.value = 2;
    // this.filter.frequency.value = 0; 
    this.filterEnvelope.connect( this.filter.frequency );

    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.frequency.value = 3000; 
    this.highPassFilter.Q.value = 5;

    this.lfo = this.audioContext.createOscillator()
    this.lfo.frequency.value = 0;
    this.lfo.connect( this.highPassFilter.frequency );
    this.lfo.type = "sawtooth";
    this.lfo.start();

    this.filterEnvelope.connect( this.lfo.frequency );

    this.output = this.audioContext.createGain();
    this.output.gain.value = 0;

    this.envelope.connect( this.output.gain );
    this.filter.connect( this.output );
    this.highPassFilter.connect( this.output );

  }

  trigger( bufferSource ) {

    this.bufferSource = bufferSource;

    this.bufferSource.playbackRate.value = 1;

    // this.lfo.connect( this.bufferSource.playbackRate );

    this.bufferSource.connect( this.filter );
    this.bufferSource.connect( this.highPassFilter );

    this.envelope.trigger();
    this.filterEnvelope.trigger();


  }

}