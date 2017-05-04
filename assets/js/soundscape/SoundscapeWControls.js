class SoundscapeVoice1 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.audioBufferPlayer = options.audioBufferPlayer;
    this.bufferMap = options.bufferMap;
    this.bpm = options.bpm;

    this.beatDuration = 60 / this.bpm;

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


    this.params = [
      {
        label: "A",
        param: this.envelope.attack,
        val: this.envelope.attack
      },      
      {
        label: "D",
        param: this.envelope.decay,
        val: this.envelope.decay
      },
      {
        label: "S",
        param: this.envelope.sustain,
        val: this.envelope.sustain
      },
      {
        label: "R",
        param: this.envelope.release,
        val: this.envelope.release
      },
      {
        label: "Fltr A",
        param: this.filterEnvelope.attack,
        val: this.filterEnvelope.attack
      },      
      {
        label: "Fltr D",
        param: this.filterEnvelope.decay,
        val: this.filterEnvelope.decay
      },
      {
        label: "Fltr S",
        param: this.filterEnvelope.sustain,
        val: this.filterEnvelope.sustain
      },
      {
        label: "Fltr R",
        param: this.filterEnvelope.release,
        val: this.filterEnvelope.release
      }

    ]

    this.sliders = new VoiceEditor( this );

    // this.envelope = new ADSREnvelope( { 
    //   audioContext: options.audioContext,
    //   attack: this.beatDuration * .125,
    //   decay: this.beatDuration * .5,
    //   sustain: 1,
    //   release: this.beatDuration * 2
    // } );

    // this.filterEnvelope = new ADSREnvelope( { 
    //   audioContext: options.audioContext,
    //   attack: this.beatDuration * .5,
    //   decay: this.beatDuration,
    //   sustain: 800,
    //   release: this.beatDuration * 2
    // } );



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

  trigger( amp, time ) {

    // this.audioBufferPlayer.stop( this.bufferSource );

    let
    offset = Math.floor( Math.random() * 256 ) * this.beatDuration,
    loopStart = Math.floor( Math.random() * 2 ) * this.beatDuration,
    loopEnd = loopStart + ( Math.floor( Math.random() * 16 )  * this.beatDuration * .0125 ),
    buffer = this.bufferMap.get( Math.floor( Math.random() * this.bufferMap.size ) );

    let
    bufferSource = this.audioBufferPlayer.start( buffer, this.audioContext.currentTime, offset, 2000, true, loopStart, loopEnd );

    bufferSource.playbackRate.value = 3;

    // this.lfo.connect( this.bufferSource.playbackRate );

    bufferSource.connect( this.filter );
    bufferSource.connect( this.highPassFilter );

    this.envelope.trigger( time );
    this.filterEnvelope.trigger( time );

    return bufferSource;

  }

  untrigger( bufferSource ) {

    this.audioBufferPlayer.stop( bufferSource );

  }

}