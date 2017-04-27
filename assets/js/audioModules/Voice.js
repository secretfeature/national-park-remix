class voice {
  
  constructor( options ) {

    this.audioContext = options.audioContext;
    this.gain = this.audioContext.createGain();
    this.envelope = new ADSREnvelope();
    this.envelope2 = new ADSR();
    this.lfo1 = new LFO();
    this.lfo2 = new LFO();

  }

}