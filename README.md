# national-park-remix

Recent government National Park Service policy shifts risk conversion to private land, relaxed environmental protection and inhumane hunting practices.The National Park Service hosts a library of public domain media that's free to download and repurpose. Lets discover the hidden rhythms and textures found in these recordings with JavaScript and the Web Audio API. We will transform the sounds of animals, natural phenomenon and park visitors into soundscapes that feature the parks' diversity and highlight the importance of wildlife conservation.

1. Clone/branch
2. Download a zipped collection of the sound library here http://nationalparkremix.com/nps-soundlibrary.zip
3. Copy contents of zip into assets/audio

To add a soundscape
1. Create a copy of one of the Soundscape###.js and SoundscapeVoice###.js files in assets/js adding an unused id
1. Create and entry in index.html with your unique id
2. Add your own addEntry() call in the window's load handler in index.html following the convention with your own custom selections
3. Select the audio files you wish to use and change Soundscape###.js and SoundscapeVoice###.js to create your own sound


