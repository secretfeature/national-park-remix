window.addEventListener( "load", function( event ) {

  const
  bpm = 120,
  beatDuration = 60 / bpm,
  audioContext = new AudioContext(),
  masterGain = audioContext.createGain(),
  audioMap = new Map(),
  bufferPlayer = new AudioBufferPlayer({
    audioContext,
    gain: masterGain
  });

  masterGain.connect( audioContext.destination );

  let
  audioFilesLoadedCount = 0;

  audioMap
    .set( 0, {
      url: "assets/audio/dawn001.wav",
      duration: beatDuration,
      playbackSpeed: 1,
      loop: true,
      loopStart: beatDuration * .25,
      loopEnd: beatDuration * .5,
      buffer: null
    })
    .set( 1, {
      url: "assets/audio/bears001.wav",
      duration: beatDuration,
      playbackSpeed: 1,
      loop: true,
      loopStart: beatDuration * .05,
      loopEnd: beatDuration * .25,
      buffer: null
    })
    .forEach( function( item, index ) {
      XHR.makeRequest( item.url )  
        .then( function( result ) {
          audioContext.decodeAudioData( result )
            .then( function( decodedData ) {
              audioMap.get( index ).buffer = decodedData;
              start();
            })
            .catch(function(error) { console.log( error ); });
        })
        .catch(function(error) { console.log( error ) });  
    });

  function start() {

    audioFilesLoadedCount++;
    
    if( audioFilesLoadedCount === audioMap.size ) {

      console.log("got it", audioMap);
      let
      item1 = audioMap.get(0),
      item2 = audioMap.get(1);

      setInterval( function() {
        bufferPlayer.start( item1.buffer, audioContext.currentTime, .5, .1, 0, 2, true, item1.loopStart, item1.loopEnd );
      }, 1000)

      setInterval( function() {
        bufferPlayer.start( item2.buffer, audioContext.currentTime, 1, 0, 0, 2, true, item2.loopStart, item2.loopEnd );
      }, 3000)
    
    }
  
  }

});
