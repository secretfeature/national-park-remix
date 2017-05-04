class Soundscape1 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.bufferMap = options.bufferMap;

    this.bpm = 20;
    this.beatDuration = 60 / this.bpm;
    
    this.audioBufferPlayer = new AudioBufferPlayer( {
      audioContext: this.audioContext
    } );

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

    this.reverb.output.connect( this.masterGain );

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    // compressor.reduction.value = -20;
    this.compressor.attack.value = 0;
    this.compressor.release.value = 0.15;

    this.masterGain.connect( this.compressor );
    this.compressor.connect( this.audioContext.destination );

    //create voices
    this.voiceMap = new Map();
    this.voiceCount = 7;
    this.currentVoiceIndex = 0;

    for( var i = 0; i < this.voiceCount; i++ ) {

      let voice = new SoundscapeVoice1( { 
        audioContext: this.audioContext, 
        audioBufferPlayer: this.audioBufferPlayer,
        bufferMap: this.bufferMap,
        bpm: this.bpm
      } );

      voice.output.connect( this.subMixGain );

      this.voiceMap.set( i, voice );

    }

    this.playing = false;

    this.songDuration = 60 * 4;

    this.measureDuration = this.beatDuration * 16;

    this.sequenceGenerator = new SequenceGenerator( {
      audioContext: this.AudioContext,
      bpm: this.bpm,
      voiceMap: this.voiceMap,
      beatsPerMeasure: 16,
      totalMeasures: 4
    } );

    this.sequenceGenerator.generateBeat();
    this.sequenceGenerator.startBeat( 0.1, false );

    // $("body").on( "mousedown touchend", () => {

    //     if ( !this.playing ) {

    //       // alert("playing");

    //       this.playing = true;
          
    //       setInterval( () => {

    //         this.currentVoiceIndex = ( this.currentVoiceIndex + 1 ) % 6;
    
    //         let voice = this.voiceMap.get( this.currentVoiceIndex );
    
    //         voice.trigger( 1, this.audioContext.currentTime );

    //       }, 3000 );

    //     }
    // });

  }


}