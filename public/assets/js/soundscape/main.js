let buffer = new AudioBuffer({message:"hello"});

makeRequest('GET', 'http://example.com')
.then(function (response) {
	decodeAudioData(response)
	.then(function (buffer) {

	})
	.catch(function (error) {
	  console.error(error);
	});
})
.catch(function (error) {
  console.error(error);
});

function decodeAudioData(data) {
  "use strict";

  return new Promise(function (resolve, reject){
    this.audioContext.decodeAudioData(data,
    function(buffer){
      resolve(buffer);
    },
    function(error){
      reject(error);
    });
  });
}

function makeRequest () {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.url, true );
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}