let buffer = new AudioBuffer({message:"hello"});

Promise.all([
  XHR.makeRequest("assets/audio/yell-DipperandGeeseFireholeRiver.mp3"),
  XHR.makeRequest("assets/audio/yell-DipperandGeeseFireholeRiver.mp3")])  
  .then(function(results) {
    console.log("got it", results.length);
  })
  .catch(function(error) { console.log(error) });

// XHR.makeRequest("assets/audio/yell-DipperandGeeseFireholeRiver.mp3")
//     .then(function(data){console.log("got it")})
//     .catch(function(error){console.log(error)});