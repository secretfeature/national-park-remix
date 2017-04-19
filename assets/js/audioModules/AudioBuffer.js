class AudioBuffer{

  constructor(options) {
    this.audioContext = options.audioContext;
    this.masterGain = options.gain;
    this.url = options.url;
    this.buffer = null;
    this.loaded = false;
    this.bufferSourceMap = {};
    this.sampleId = -1;
    this.buffer = options.buffer;
    this.loaded = true;
  }

}



// SampleBuffer.prototype.start = function(loop, loopEnd) {

//   "use strict";



//   if( this.loaded ){

//     var 

//     loop = loop || false,

//     buffer = this.buffer,

//     bufferSource = this.audioContext.createBufferSource(),

//     gain = this.audioContext.createGain(),

//     time = this.audioContext.currentTime;



//     bufferSource.loop = loop;

//     bufferSource.buffer = buffer;

//     bufferSource.connect( gain );

//     gain.connect( this.masterGain );

//     this.sampleId++;

//     this.bufferSourceMap[ this.sampleId ] = {

//       bufferSource:bufferSource,

//       gain: gain,

//       time: time

//     };

//     var endHandler = this.createEndHandler( this.sampleId );

//     bufferSource.onended = endHandler;

//     if( loopEnd ){

//       bufferSource.loopEnd = loopEnd;

//       bufferSource.loopStart = 0;

//       bufferSource.start( time );

//     }

//     else

//       bufferSource.start( time );

//     return this.sampleId;

//   }

// };



// SampleBuffer.prototype.createEndHandler = function ( id ){

//   "use strict";

  

//   var _this = this;

//   var sampleId = id;

//   return function(){

//       _this.stop( sampleId );

//   };

// };



// SampleBuffer.prototype.stop = function ( id ){

//   "use strict";

    

//   if ( this.bufferSourceMap[ id ] && ( ( this.audioContext.currentTime - this.bufferSourceMap[ id ].time ) > 0.01 ) ) {

//     this.bufferSourceMap[ id ].bufferSource.stop( this.audioContext.currentTime );

//     this.bufferSourceMap[ id ].bufferSource.disconnect( this.bufferSourceMap[ id ].gain );

//     this.bufferSourceMap[ id ].gain.disconnect( this.masterGain );

//     delete this.bufferSourceMap[ id ];

//   }



// };



// SampleBuffer.prototype._loadSample = function (){

//   "use strict";



//   if( this.url ){

//     var

//     _this = this,

//     request = new XMLHttpRequest();

//     request.open( "GET", this.url, true );

//     request.responseType = "arraybuffer";



//     request.onload = function() { 

//       _this.audioContext.decodeAudioData( request.response, 

//         function( buffer ) {

//           _this.buffer = buffer;

//           _this.loaded = true;

//           if( _this.loadCompleteCallback ) 

//             _this.loadCompleteCallback();

//         }, 

//         function( error ){



//           if( _this.errorCallback )

//             _this.errorCallback( error );

//           console.log( error );

//         }

//       );

//     };

//     request.send();

//   }

// };