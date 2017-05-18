class SoundscapeVoice003 {

  constructor( options ) {

    //Set parameters from options received from parent class.
    this.audioContext = options.audioContext;
    this.audioBufferPlayer = options.audioBufferPlayer;
    this.bufferMap = options.bufferMap;
    //Set beats per minute.
    this.bpm = options.bpm;

    //Set duration of a single beat (seconds)
    this.beatDuration = 60 / this.bpm;

    //Create output gain.
    this.output = this.audioContext.createGain();
    this.output.gain.value = 0;

    //Create filter (lowpass by default). Connects to output gain.
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.Q.value = 20;
    this.filter.frequency.value = 0;
    this.filter.connect( this.output );

    //Create highpass filter. Connects to output gain.
    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.frequency.value = 22050 * .5;
    this.highPassFilter.Q.value = 5;
    this.highPassFilter.connect( this.output );

    //Create and start low frequency oscillator.
    this.lfo = this.audioContext.createOscillator()
    this.lfo.frequency.value = 0;
    //Set shape of oscillator
    this.lfo.type = "sawtooth";
    //Start oscillator
    this.lfo.start();

    //low frequency oscillator modulates highpass filter frequency
    this.lfo.connect( this.highPassFilter.frequency );

    //Create attack, decay, sustain, release envelope
    this.envelope = new ADSREnvelope( {
      audioContext: options.audioContext,
      attack: this.beatDuration * .1,
      decay: this.beatDuration * .3,
      sustain: 2.3,
      release: this.beatDuration * 3
    } );

    //Envelope controls outpus gain (volume level of output sound)
    this.envelope.connect( this.output.gain );


    //Create attack, decay, sustain, release envelope to control filter
    this.filterEnvelope = new ADSREnvelope( {
      audioContext: options.audioContext,
      attack:  this.beatDuration * 2,
      decay: this.beatDuration * 6,
      sustain: 44050,
      release: this.beatDuration * 2
    } );

    //Connect filter envevlope to filter frequency and LFO frequency
    this.filterEnvelope.connect( this.filter.frequency );
    this.filterEnvelope.connect( this.lfo.frequency );
  }

  //Trigger this voice at the specified time.
  trigger( time ) {

    //Stop the previously played buffer
    if( this.bufferSource ){

      this.audioBufferPlayer.stop( this.bufferSource );

    }

    //Select a raondom buffer from loaded sounds.
    //Select a random point to begin playback (offset)
    //Begin loop at the selected offset
    //Set a random end loop point where loop will end and return to beginning of loop
    let
    buffer = this.bufferMap.get( Math.floor( Math.random() * this.bufferMap.size ) ),
    offset = Math.random() * buffer.duration,
    loopStart = offset,
    loopEnd = loopStart + ( this.beatDuration * .5 ) / Math.ceil( Math.random() * 4 );

    console.log(`OFFSET IS ${offset}`);

    //Create and start playing a buffer instance with set parameters
    this.bufferSource = this.audioBufferPlayer.start( buffer, this.audioContext.currentTime, offset, 2000, true, loopStart, loopEnd );

    //Set random playback rate (controls pitch and speed of playback)
    this.bufferSource.playbackRate.value = Math.ceil( Math.random() * 4 ) / Math.ceil( Math.random() * 4 ) / Math.ceil( Math.random() * 4 );

    //won't work on some browsers (safari and mobile)
    // this.lfo.connect( bufferSource.playbackRate );

    //Connect buffer instance to filters.
    this.bufferSource.connect( this.filter );
    this.bufferSource.connect( this.highPassFilter );

    //Trigger envelopes
    this.envelope.trigger( time );
    this.filterEnvelope.trigger( time );

  }

  untrigger() {

    //Stop playing this voice.
    if( this.bufferSource ){

      // this.lfo.disconnect( this.bufferSource.playbackRate );
      this.audioBufferPlayer.stop( this.bufferSource );

    }

    //Stop envelopes.
    this.envelope.stop();
    this.filterEnvelope.stop();

    //Set parameters to values that do not emit sound.
    this.output.gain.value = 0;
    this.filter.frequency.value = 0;
    this.highPassFilter.frequency.value = 22050 * .5;

  }

  reset() {

    //Set parameters to default settings, ready to play sound.
    this.output.gain.value = 1;
    this.filter.frequency.value = 0;
    this.highPassFilter.frequency.value = 22050 * .5;

  }

}
