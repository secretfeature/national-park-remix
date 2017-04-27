class AudioBufferLoader {

  static load( urls, audioContext ) {
    "use strict";

    return new Promise( function ( resolve, reject ) {
      let buffers = new Map();
      urls.forEach( function( item, index ) {
        AudioBufferLoader.makeRequest( item )  
          .then( function( result ) {
            audioContext.decodeAudioData( result, function( decodedData ) {
                buffers.set( index, decodedData );
                if( buffers.size === urls.size ) {
                  resolve( buffers );
                }
            });
          })
          .catch( reject );
      } );
    } );

  }

  static makeRequest( url ) {
    "use strict";

    return new Promise( function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true );
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject( {
            status: this.status,
            statusText: xhr.statusText
          } );
        }
      };

      xhr.onerror = function () {
        reject( {
          status: this.status,
          statusText: xhr.statusText
        } );
      };

      xhr.send();
 
    });
  
  }

}