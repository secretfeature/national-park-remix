class SoundscapeVoice1 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.audioBufferPlayer = options.audioBufferPlayer;
    this.bufferMap = options.bufferMap;
    this.bpm = options.bpm;

    this.beatDuration = 60 / this.bpm;

    this.output = this.audioContext.createGain();
    this.output.gain.value = 0;

    this.filter = this.audioContext.createBiquadFilter();
    this.filter.Q.value = 20;
    this.filter.frequency.value = 0;
    this.filter.connect( this.output ); 

    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.frequency.value = this.filter.frequency.maxValue * .5; 
    this.highPassFilter.Q.value = 5;
    this.highPassFilter.connect( this.output );

    this.lfo = this.audioContext.createOscillator()
    this.lfo.frequency.value = 0;
    this.lfo.connect( this.highPassFilter.frequency );
    this.lfo.type = "sawtooth";
    this.lfo.start();

    this.envelope = new ADSREnvelope( { 
      audioContext: options.audioContext,
      attack: this.beatDuration * 2,
      decay: this.beatDuration * .5,
      sustain: 1.5,
      release: this.beatDuration * 6
    } );

    this.envelope.connect( this.output.gain );

    this.filterEnvelope = new ADSREnvelope( { 
      audioContext: options.audioContext,
      attack:  this.beatDuration * 4,
      decay: this.beatDuration * 3,
      sustain: this.filter.frequency.maxValue,
      release: this.beatDuration * 4
    } );

    this.filterEnvelope.connect( this.lfo.frequency );
    this.filterEnvelope.connect( this.filter.frequency );

  }

  trigger( amp, time ) {

    // this.audioBufferPlayer.stop( this.bufferSource );
    if( this.bufferSource )
      this.audioBufferPlayer.stop( this.bufferSource );

    let
    buffer = this.bufferMap.get( Math.floor( Math.random() * this.bufferMap.size ) ),
    offset = Math.random() * buffer.duration,
    loopStart = offset,
    loopEnd = loopStart + ( this.beatDuration * .5 ) / Math.ceil( Math.random() * 4 );

    //buffer, time, offset, duration, loop, loopStartTime, loopEndTime
    let
    bufferSource = this.audioBufferPlayer.start( buffer, this.audioContext.currentTime, offset, 2000, true, loopStart, loopEnd );

    bufferSource.playbackRate.value = Math.ceil( Math.random() * 4 ) / Math.ceil( Math.random() * 4 );

    //won't work on some browsers (safari and mobile)
    // this.lfo.connect( bufferSource.playbackRate );

    bufferSource.connect( this.filter );
    bufferSource.connect( this.highPassFilter );

    this.envelope.trigger( time );
    this.filterEnvelope.trigger( time );
    this.lfo.connect( this.highPassFilter.frequency );

    this.bufferSource = bufferSource;

    return bufferSource;

  }

  untrigger( bufferSource ) {

    this.audioBufferPlayer.stop( bufferSource );

  }

}