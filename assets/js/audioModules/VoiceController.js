class VoiceController {

  constructor( options ) {

    this.audioContext = options.audioContext;
    this.masterGain = options.gain;
    this.constructionHandler = options.constructionHandler;
    this.destructionHandler = options.destructionHandler;

    // this.map = new Map();
    // this.currentVoiceId = -1;

  }

  start( time, options ) {

    this.currentVoiceId++;

    let voice = this.constructionHandler( time, options );
    
    voice.id = this.currentVoiceId;

    // this.map.set( this.currentVoiceId, voice );

    return voice;

  }

  stop( voice, time ) {

    destructionHandler( voice, time );

  }

}