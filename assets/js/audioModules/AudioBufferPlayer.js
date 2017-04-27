class AudioBufferPlayer {

  constructor( options ) {

    this.audioContext = options.audioContext;

    this.bufferSourceMap = {};
    this.bufferSourceId = -1;

  }

  start( buffer, time = this.audioContext.currentTime, offset = 0, duration, loop = false, loopStartTime = 0, loopEndTime ) {

    let
    bufferSource = this.audioContext.createBufferSource();

    duration = duration || buffer.duration;
    loopEndTime = loopEndTime || buffer.duration;

    bufferSource.loop = loop;
    bufferSource.buffer = buffer;
    bufferSource.startTime = time;

    var endHandler = this.createEndHandler( bufferSource );
    bufferSource.onended = endHandler;

    if( loop ) {
    
      bufferSource.loopEnd = loopEndTime;
      bufferSource.loopStart = loopStartTime;
      bufferSource.start( time, offset, duration );  
      bufferSource.stop( time + duration );
    
    }
    else {

      bufferSource.start( time, offset, duration );

    }

    this.bufferSourceMap[ bufferSource ] = bufferSource;

    return bufferSource;
    
  }



  createEndHandler( bufferSource ) {

    return () => this.stop( bufferSource );

  }


  

  stop( bufferSource ){

    if ( this.bufferSourceMap[ bufferSource ] && ( ( this.audioContext.currentTime - bufferSource.startTime ) > 0.01 ) ) {

      bufferSource.stop( this.audioContext.currentTime );

      bufferSource.disconnect();

      delete this.bufferSourceMap[ bufferSource ];

    }

  }

}