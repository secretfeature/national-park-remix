class Reverb {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.url = options.url;

    this.convolver = this.audioContext.createConvolver();
    this.input = this.audioContext.createGain();

    this.input.connect( this.convolver );
    this.input.gain.value = 1;

    this.output = this.convolver;

    let urls = new Map()
      .set( 0, this.url );

    AudioBufferLoader.load( urls, this.audioContext )
      .then( ( buffers ) => {
        this.convolver.buffer = buffers.get( 0 );
        console.log(this.convolver, buffers)
      } )
      .catch( ( error ) => console.log( error ) );
  }


}