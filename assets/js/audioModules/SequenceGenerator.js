class SequenceGenerator {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.bpm = options.bpm;
    this.voiceMap = options.voiceMap;
    this.beatsPerMeasure = options.beatsPerMeasure || 16;
    this.totalMeasures = options.totalMeasures || 4;

    //probabilities
    this.repeatAferFourProbabilty = 0.75;
    this.repeatAferEightProbabilty = 0.5;
    this.reverseOnFourProbabilty = 0.5;
    this.reverseOnEightProbability = 0.5;
    this.repeatMeasureProbability = 0.5;

    this.scheduled = [];

    this.beatSegments = {
      2:[[
          [1.0, 0.0],
          [1.0, 0.0],
          [0.5, 1.0],
          [0.0, 0.0],
          [0.5, 0.5],
          [0.0, 0.0],
          [1.0, 0.0]
        ],
        [
          [1.0, 0.0],
          [0.0, 0.0],
          [0.0, 0.0],
          [0.0, 1.0],
          [0.5, 0.5],
          [0.0, 0.0],
          [0.0, 0.0]
        ],
        [
          [1.0, 0.0],
          [1.0, 0.0],
          [0.0, 1.0],
          [0.0, 1.0],
          [0.5, 0.5],
          [0.0, 0.0],
          [0.5, 1.0]
        ],
        [
          [1.0, 0.0],
          [0.0, 0.0],
          [0.0, 0.0],
          [0.0, 0.0],
          [0.5, 0.0],
          [0.0, 0.0],
          [0.5, 0.0]
        ],
        [
          [0.0, 0.0],
          [1.0, 0.0],
          [0.0, 0.0],
          [0.0, 0.0],
          [0.5, 0.5],
          [0.0, 0.0],
          [0.0, 0.0]
       ]],
      3:[[
          [1.0, 0.5, 1.0],
          [1.0, 0.0, 0.0],
          [0.5, 0.5, 1.0],
          [0.0, 0.0, 1.0],
          [0.5, 0.5, 0.5],
          [1.0, 1.0, 1.0],
          [0.5, 0.5, 0.5]
        ],
        [
          [1.0, 0.0, 0.0],
          [1.0, 1.0, 0.0],
          [0.0, 0.0, 1.0],
          [0.0, 0.0, 0.0],
          [0.5, 0.5, 0.5],
          [1.0, 0.0, 0.0],
          [1.0, 0.0, 0.0]
        ],
        [
          [1.0, 0.0, 0.0],
          [1.0, 0.0, 0.0],
          [1.0, 0.0, 1.0],
          [0.0, 0.0, 0.0],
          [0.5, 0.5, 0.5],
          [1.0, 0.0, 0.0],
          [1.0, 0.5, 0.5]
        ],
        [
          [1.0, 1.0, 0.0],
          [1.0, 0.0, 0.0],
          [1.0, 0.0, 1.0],
          [1.0, 0.0, 0.0],
          [0.5, 0.5, 0.5],
          [1.0, 1.0, 0.0],
          [0.0, 0.0, 0.0]
       ]],
      4:[[
          [1.0, 0.5, 1.0, 0.0],
          [1.0, 0.0, 0.0, 0.0],
          [0.5, 0.5, 1.0, 1.0],
          [1.0, 1.0, 1.0, 1.0],
          [0.5, 0.5, 0.5, 0.5],
          [0.0, 0.0, 0.0, 0.0],
          [1.0, 0.0, 0.0, 0.0]
        ],
        [
          [1.0, 0.0, 1.0, 0.0],
          [1.0, 0.0, 1.0, 0.0],
          [1.0, 0.0, 1.0, 1.0],
          [1.0, 0.0, 0.0, 0.0],
          [0.5, 0.5, 0.5, 0.5],
          [1.0, 1.0, 1.0, 1.0],
          [1.0, 0.0, 0.0, 0.0]
        ],
        [
          [1.0, 1.0, 1.0, 0.0],
          [1.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0, 0.0],
          [0.5, 0.5, 0.5, 0.5],
          [0.0, 1.0, 0.0, 1.0],
          [1.0, 0.0, 1.0, 0.0]
       ]]
      };

  }

  generateSegment( currentStep, previousSegmentLength, currentMeasure, reverse ) {

    let 
    steps = [],
    segment = [];

    if ( currentMeasure === this.totalMeasures )
      return;

    if( currentStep === 16 ) {
      this.generateSegment( 0, 0, currentMeasure + 1, "complete!" );
      return;
    }
    
    else if ( currentMeasure === 2 ){
    
      if( Math.random() > this.repeatMeasureProbability ) {
        
        segment = this.beatMeasures[ currentMeasure - 2 ];

        this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => { 
          
          this.beatMeasures[ currentMeasure ][ index ] = segment[ index ];

        } );

        this.generateSegment( 0, 0, currentMeasure + 1, "measure 2 repeat" );

        return;

      }

    }

    if( ( currentStep === 4 )  && ( Math.random() > this.repeatAferFourProbabilty ) ) {

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => {
        
        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( value );
        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( value );
        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( value );

      } );

      this.generateSegment( 0, 0, currentMeasure + 1, "repeat four" );

    }

    else if( ( currentStep === 8 ) && ( Math.random() > this.repeatAferEightProbabilty ) ) {

      let reverseSteps = ( Math.random() > this.reverseOnEightProbability );

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => {

          var steps = value;
          
          if( reverseSteps ){
            steps = steps.reverse();
          }

          this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( steps );

      } );

      this.generateSegment( 0, 0, currentMeasure + 1, "repeat eight reverse:" + reverse );

    }

    else if ( currentStep === 12 ) {
    
      segment = this.beatSegments[ 2 ][ Math.floor( Math.random() * this.beatSegments[ 2 ].length ) ];

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => {

        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( segment[ index ] );

      } );

      this.generateSegment( currentStep + 2, 2, currentMeasure );

    }

    else if ( currentStep === 13 ) {

      segment = this.beatSegments[ 3 ][ Math.floor( Math.random() * this.beatSegments[ 3 ].length ) ];

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => { 

        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( segment[ index ] );
      
      } );

      this.generateSegment( 0, 0, currentMeasure + 1, "step 13" );

    }

    else if ( currentStep === 14 ) {

      segment = this.beatSegments[ 2 ][ Math.floor( Math.random() * this.beatSegments[ 3 ].length ) ];

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => { 

        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( segment[ index ] );
      
      } );

      this.generateSegment( 0, 0, currentMeasure + 1, "step 14" );
        
    }
    else{

      let segmentLength = 
      ( ( currentMeasure === 1 || currentMeasure === 3 ) && ( currentStep > 1 && currentStep < 10  ) ) ? 
        this.getRandomSegmentLength( 3 ) : this.getRandomSegmentLength( 2 ) ;

      if( currentStep === 12 && ( currentMeasure === 1 || currentMeasure === 3 ) )
        segmentLength = 4;

      segment = this.beatSegments[ segmentLength ][ Math.floor( Math.random() * this.beatSegments[ segmentLength ].length ) ];

      this.beatMeasures[ currentMeasure ].forEach( ( value, index ) => {

        this.beatMeasures[ currentMeasure ][ index ] = this.beatMeasures[ currentMeasure ][ index ].concat( segment[ index ] );

      });

      this.generateSegment( currentStep + segmentLength, segmentLength, currentMeasure );

    }

  }

  getRandomSegmentLength( max ) {

    return ( 1 + Math.ceil( Math.random() * max ) );

  }

  getRandomArraySelection( sourceArray ) {

    let
    amount = Math.ceil( Math.random() * this.selectedSamples.length ),
    array = [],
    index;

    for ( var i = 0; i < amount; i++ ) {

      index = Math.random() * this.selectedSamples.length;
      array.push( this.selectedSamples[ Math.floor( index ) ] );

    }

    return array;

  }

  generateBeat() {

    this.stopBeat();

    this.swing = Math.random() * 0.5;
    this.currentMeasure = 0;
    this.beat = [];
    this.beatMeasures = 
      [[
        [],[],[],[],[],[],[]
      ],
      [
        [],[],[],[],[],[],[]
      ],
      [
        [],[],[],[],[],[],[]
      ],
      [
        [],[],[],[],[],[],[]
      ]];

    this.generateSegment( 0, 0, 0 );

    var measureSegment = 0,
    measure = 0;

  }

  startBeat( delayValue, loop ) {
    "use strict";

    var delay = delayValue || 0.1;

    if( this.playing ) {

      this.stopBeat();

    }
    
    this.beatDuration = ( 60 / this.bpm ) ;

    let 
    amp = 0,
    scheduled = this.scheduled,
    voiceMap = this.voiceMap,
    beatDuration = this.beatDuration,
    beatsPerMeasure = this.beatsPerMeasure;

    this.beatMeasures.forEach( ( measure, measureIndex ) => {

      measure.forEach( ( value, index ) => {

        for( var i = 0; i < measure[ index ].length; i++ ) {

          amp = measure[ index ][ i ];

          if( amp > 0 ) {

            let voice = voiceMap.get( index );

            scheduled.push( { 
              source: voice.trigger( amp, (  i * beatDuration ) + ( delay + ( measureIndex * ( beatsPerMeasure * beatDuration ) ) ) ),
              voice: voice
            } );

          }
        }

      } );

    } );

    this.playing = true;

    this.loopTimeoutId = setTimeout( () => {

        if( loop === true ) {
        
          this.startBeat( 0, true );
        
        }
        else {
          
          this.stopBeat();
        
        }

      }, ( ( delay + ( ( 60 / this.bpm ) * 16 ) ) * 1000 ) );

  }

  stopBeat() {

    if( this.loopTimeoutId )
      clearTimeout( this.loopTimeoutId );

    this.scheduled.forEach( ( obj ) => {

      obj.voice.untrigger( obj.source );

    } );

    this.scheduled = [];

    this.playing = false;

    // console.log("STOP BEAT");
  }

  startSample( index, time, ampValue, durationValue, playbackOffsetValue ) {
    "use strict";

    var amp = ampValue || 1;
    var sample = this.samples[ index ];
    var playbackOffset = playbackOffsetValue || 1;
    var duration = durationValue || 8;
    // console.log( index, time, amp, sample )
    if( sample.type === "sampleMap" ) {
      var id = sample.sampleMap.start( sample.index, time, amp, duration, playbackOffset );
      this.scheduled.push( {
        source: sample.sampleMap,
        id: id
      } );

      // console.log("play", index, time)
    }

  }

}