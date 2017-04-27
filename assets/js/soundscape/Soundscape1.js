class Soundscape1 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.bufferMap = options.bufferMap;

    this.$buttonElement = $(".status-button");
    
    this.bpm = 120;
    this.beatDuration = 60 / this.bpm;
    this.audioBufferPlayer = new AudioBufferPlayer( {
      audioContext: this.audioContext
    } );

    this.currentVoiceIndex = 0;

    this.voiceMap = new Map();

    this.voiceMap
      .set( 0, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) )
      .set( 1, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) )
      .set( 2, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) )
      .set( 3, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) )
      .set( 4, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) )
      .set( 5, new SoundscapeVoice1( {
        audioContext: this.audioContext
      } ) );

    this.reverb = new Reverb( {
      audioContext: this.audioContext,
      url: "assets/audio/impulses/space.wav"
    } );

    this.masterGain = this.audioContext.createGain();

    this.dryMixGain = this.audioContext.createGain();
    this.dryMixGain.connect( this.masterGain );
    this.dryMixGain.gain.value = .5;

    this.subMixGain = this.audioContext.createGain();
    this.subMixGain.connect( this.dryMixGain );
    this.subMixGain.connect( this.reverb.input );

    this.reverb.output.connect( this.audioContext.destination );
    this.masterGain.connect( this.audioContext.destination );

    this.voiceMap.get( 0 ).output.connect( this.subMixGain );
    this.voiceMap.get( 1 ).output.connect( this.subMixGain );
    this.voiceMap.get( 2 ).output.connect( this.subMixGain );
    this.voiceMap.get( 3 ).output.connect( this.subMixGain );
    this.voiceMap.get( 4 ).output.connect( this.subMixGain );
    this.voiceMap.get( 5 ).output.connect( this.subMixGain );


    this.playing = false;

    $("body").on( "mousedown touchend", () => {

        if ( !this.playing ) {

          // alert("playing");

          this.playing = true;

          this.$buttonElement.removeClass("ready");
          
          setInterval( () => {
            this.currentVoiceIndex = ( this.currentVoiceIndex + 1 ) % 6;
    
            let voice = this.voiceMap.get( this.currentVoiceIndex );
    
            this.audioBufferPlayer.stop( voice.bufferSource );
    
            let
            offset = Math.floor( Math.random() * 256 ) * this.beatDuration,
            loopStart = Math.floor( Math.random() * 2 ) * this.beatDuration,
            loopEnd = loopStart + ( Math.floor( Math.random() * 16 )  * this.beatDuration * .0125 ),
            buffer = this.bufferMap.get( Math.floor( Math.random() * this.bufferMap.size ) );

            voice.lfo.frequency.value = this.bpm / 16;
    
            voice.trigger(
              // buffer, time, offset, duration, loop, loopStartTime, loopEndTime
              this.audioBufferPlayer.start( buffer, this.audioContext.currentTime, offset, 2000, true, loopStart, loopEnd )
            );
          }, 3000 );

        }
    });

  }


}