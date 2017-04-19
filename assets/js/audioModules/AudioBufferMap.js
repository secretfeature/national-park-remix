class AudioBufferMap {
    constructor( options ) {
        this.audioContext = options.audioContext;
        this.map = new Map();
    }

    decodedData(data) {
        this.audioContext.decodeAudioData(data).then(function(decodedData) {
            
        }); 
    }
}