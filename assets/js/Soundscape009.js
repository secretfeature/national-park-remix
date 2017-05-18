class Soundscape009 {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.bufferMap = options.bufferMap;

    //set beats per minute and save duration of a single beat
    this.bpm = 800;
    this.beatDuration = 60 / this.bpm;
    
    //create instance of audio buffer player for creating instances of and playing sounds
    this.audioBufferPlayer = new AudioBufferPlayer( {
      audioContext: this.audioContext
    } );

    //create convolution reverb with impulse response .wav file
    this.reverb = new Reverb( {
      audioContext: this.audioContext,
      url: "assets/audio/impulses/space_001.wav"
    } );

    //Setup audio bus

     //Create Master Gain. Connects to compressor.
    this.masterGain = this.audioContext.createGain();
    this.reverb.output.connect( this.masterGain );

    //Create dry gain (no reverb). Connects to master gain.
    this.dryMixGain = this.audioContext.createGain();
    this.dryMixGain.connect( this.masterGain );
    this.dryMixGain.gain.value = .5;

    //Create sub mix gain. Splits audio to reverb and dry mix.
    this.subMixGain = this.audioContext.createGain();
    this.subMixGain.connect( this.dryMixGain );
    this.subMixGain.connect( this.reverb.input );


    //Create compressor. Connects to speakers. Master gain connects to compressor, prevents over driving audio
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    // compressor.reduction.value = -20;
    this.compressor.attack.value = 0;
    this.compressor.release.value = 0.15;
    this.compressor.connect( this.audioContext.destination);

    //Set how often voices will be triggered.
    this.triggerInterval = this.beatDuration * 1.5;
    this.nextTrigger = 0;

    //create voices
    this.voiceMap = new Map();
    
    //How many voices?
    this.voiceCount = 20;
    this.currentVoiceIndex = 0;

    for( var i = 0; i < this.voiceCount; i++ ) {

      let voice = new SoundscapeVoice009( { 
        audioContext: this.audioContext, 
        audioBufferPlayer: this.audioBufferPlayer,
        bufferMap: this.bufferMap,
        bpm: this.bpm
      } );

      voice.output.connect( this.subMixGain );

      this.voiceMap.set( i, voice );

    }

    //Not playing until start method is called.
    this.playing = false;

  }

  //Begin playing soundscape.
  start() {

    //now playing
    this.playing = true;

    //Reset each voices paramters to default settings.
    this.voiceMap.forEach( function( voice ) {

      voice.reset();

    } );

    //Reconnect master gain to compressor
    this.masterGain.connect( this.compressor );

    //Trigger first sound
    let voice = this.voiceMap.get( this.currentVoiceIndex );
    this.nextTriggerTime = this.audioContext.currentTime;
    voice.trigger(this.nextTriggerTime );
    
    //Setup interval to check if the next sheduled sound has played.
    this.interval = setInterval( () => {

      //If next trigger has occurred, schedule the following trigger.
      if ( this.audioContext.currentTime > this.nextTriggerTime ) {

        this.currentVoiceIndex = ( this.currentVoiceIndex + 1 ) % this.voiceCount;
        voice = this.voiceMap.get( this.currentVoiceIndex );
        this.nextTriggerTime += this.triggerInterval;
        voice.trigger( this.nextTriggerTime );

      }

    }, ( this.beatDuration * 1000 ) * .333 );  //.25

  }

  //End soundscape.
  stop() {

    this.playing = false;

    if( this.interval ) {

      clearInterval( this.interval );
    
    }

    this.voiceMap.forEach( function( voice ) {

      voice.untrigger();

    } );

    this.audioBufferPlayer.clearBuffers();

    this.masterGain.disconnect( this.compressor );

  }


}