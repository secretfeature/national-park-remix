window.addEventListener( "load", function( event ) {

  window.AudioContext = window.AudioContext||window.webkitAudioContext;

  const
  audioContext = new AudioContext(),
  audioURLs = new Map(),
  $buttonElement = $(".status-button");

  let
  bufferMap = new Map();

  audioURLs.set( 0, "assets/audio/bears001.wav" );
  audioURLs.set( 1, "assets/audio/dawn001.wav" );
  audioURLs.set( 2, "assets/audio/cranes001.wav" );
  audioURLs.set( 3, "assets/audio/yell-ChorusFrogs.mp3" );
  audioURLs.set( 4, "assets/audio/yell-DipperandGeeseFireholeRiver.mp3" );

  $buttonElement
    .addClass("starting")
    .on('click touchend', startClickHandler);

  function startClickHandler( event ) {

    event.stopPropagation();
    event.preventDefault();

    $buttonElement
      .removeClass("starting")
      .addClass("loading")
      .off( 'click touchend', startClickHandler );
     
    AudioBufferLoader
      .load( audioURLs, audioContext )
      .then( function( buffers ) {

        $buttonElement
          .removeClass("loading")
          .addClass("ready");

        const
        soundscape = new Soundscape1( {
          
          bufferMap: buffers,
          audioContext

        } );
      })
      .catch( function( error ) {
        console.log( error );
      });

  }

} );