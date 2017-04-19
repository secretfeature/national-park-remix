class AudioBufferPlayer{

  constructor( options ) {

    this.audioContext = options.audioContext;
    this.masterGain = options.gain;

    this.bufferSourceMap = {};
    this.bufferSourceId = -1;

  }

  start( buffer, time = this.audioContext.currentTime, playbackRateStart = 1, playbackRateEnd = 1, offset = 0, duration, loop = false, loopStartTime = 0, loopEndTime = this.buffer.duration ) {

    let
    bufferSource = this.audioContext.createBufferSource(),
    gain = this.audioContext.createGain();

    duration = duration || buffer.duration;

    bufferSource.loop = loop;
    bufferSource.buffer = buffer;

    bufferSource.connect( gain );
    gain.connect( this.masterGain );

    this.bufferSourceId++;
    this.bufferSourceMap[ this.bufferSourceId ] = {
      bufferSource:bufferSource,
      gain: gain,
      time: time
    };

    var endHandler = this.createEndHandler( this.bufferSourceId );
    bufferSource.onended = endHandler;

    if( loop ) {
    
      bufferSource.loopEnd = loopEndTime;
      bufferSource.loopStart = loopStartTime;
      bufferSource.start( time, offset, duration );  
      bufferSource.stop( time + duration );
      bufferSource.playbackRate.value = playbackRateStart;
      bufferSource.playbackRate.setValueAtTime( .5, time);
      bufferSource.playbackRate.linearRampToValueAtTime( playbackRateEnd, time + duration );
    
    }
    else {

      bufferSource.start( time, offset, duration );
      bufferSource.playbackRate.value = playbackRateStart;
      bufferSource.playbackRate.setValueAtTime( .5, time);
      bufferSource.playbackRate.linearRampToValueAtTime( playbackRateEnd, time + duration );
    }

    return this.bufferSourceId;

  }



  createEndHandler( id ) {

    return () => this.stop(id);

  }


  

  stop( id ){

    if ( this.bufferSourceMap[ id ] && ( ( this.audioContext.currentTime - this.bufferSourceMap[ id ].time ) > 0.01 ) ) {

      this.bufferSourceMap[ id ].bufferSource.stop( this.audioContext.currentTime );
      this.bufferSourceMap[ id ].bufferSource.disconnect( this.bufferSourceMap[ id ].gain );
      this.bufferSourceMap[ id ].gain.disconnect( this.masterGain );

      delete this.bufferSourceMap[ id ];

    }

  }

}