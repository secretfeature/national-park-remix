window.AudioContext = window.AudioContext||window.webkitAudioContext;

window.soundscapeMap = new Map();

const
audioContext = new AudioContext(),
analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;

const
bufferLength = analyser.frequencyBinCount,
dataArray = new Uint8Array( bufferLength );

analyser.getByteTimeDomainData( dataArray );

let
currentCTX,
drawWaveformRAF;

drawWaveform();

window.addEntry = function( obj ) {

  let $entry = $( "#" + obj.title );

  if( !$entry ) {
    alert("This soundscape was not found");
    return;
  }

  let 
  $player = $entry.find( ".player" ),
  $playButton = $player.find( ".play.button" ),
  $waveform = $player.find( ".waveform" ),
  ctx = $waveform[0].getContext('2d'),
  audioURLs = new Map();

  var startClickHandler = createStartClickHandler( obj );

  $playButton.on( "click touchend", startClickHandler )

  function createStartClickHandler( obj ) {
    
    return function( event ) {

      event.stopPropagation();
      event.preventDefault();

      if ( !window.webAudioStarted ) {
        let osc = audioContext.createOscillator();
        osc.start( 0 );
        osc.stop(0);
        window.webAudioStarted = true;        
      }

      $("body").find(".playing").removeClass("playing");

      window.requestedSoundscape = obj.title;

      let soundscape = window.soundscapeMap.get( obj.title );

      if( window.soundscape && window.soundscape.playing ) {

        $playButton.removeClass("playing");

        window.soundscape.stop();
        window.soundscape.masterGain.disconnect();

        resetWaveform( ctx );

        if ( window.soundscape === soundscape )
          return;

      }

      window.$playButton = $playButton; 

      if( soundscape ) {

        $playButton.addClass("playing");
        
        window.soundscape = soundscape;

        soundscape.start();
        soundscape.masterGain.connect( analyser );

        currentCTX = ctx;

        return;

      }

      let
      bufferMap = new Map();

      obj.audio.forEach( function( item, i ){
        audioURLs.set( i, item );
      } );

      $playButton
        .removeClass("starting")
        .addClass("loading");
        // .off( 'click touchend', startClickHandler );
       
      AudioBufferLoader
        .load( audioURLs, audioContext )
        .then( function( buffers ) {

          $playButton
            .removeClass("loading")
            .addClass("ready");

          let soundscape = new obj.SoundscapeClass( {
            
            bufferMap: buffers,
            audioContext

          } );

          window.soundscapeMap.set( obj.title, soundscape );
          window.soundscape = soundscape;

          if( window.requestedSoundscape === obj.title ){

            resetWaveform( ctx );

            $playButton.addClass("playing");
            soundscape.start();
            soundscape.masterGain.connect( analyser );
            
            currentCTX = ctx;

          }

        })
        .catch( function( error ) {
          console.log( error );
        });
      }
  }

  function resetWaveform( ctx ) {

    ctx.strokeStyle = "#989880";
    ctx.beginPath();
    ctx.moveTo( 0, 20 );
    ctx.lineTo( 400, 20 );
    ctx.stroke();

  }
  
}

function drawWaveform() {
  
  drawWaveformRAF = requestAnimationFrame( drawWaveform );

  if ( window.soundscape ) {
  
    let ctx = currentCTX,
    x = 0,
    sliceWidth = 200 * ( 1 / bufferLength );

    ctx.clearRect( 0, 0, 200, 40 );

    analyser.getByteTimeDomainData( dataArray );

    ctx.strokeStyle = "#989880";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (var i = 0; i < bufferLength; i++) {

      let 
      v = ( dataArray[ i ] / 128.0 ),
      y = v * 20;

      if ( i === 0 ) {
        
        ctx.moveTo( 0, y );
      
      } else {
      
        ctx.lineTo( x, y );
      
      }

      x += sliceWidth;

    }

    ctx.stroke();

  }

}