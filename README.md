RAD DWS-1 Synth
===============

Web Audio API synthesizer with FM synthesis, distortion, bit crusher, reverb, delay, compressor, equalization and panning.

* Waveforms: sine, square, sawtooth, triangle
* Samplerate: 44100
* Presets
* Responsive interface

Version
-------
1.0

Supported browsers
------------------

Chrome v36+

Firefox v31+ (no support for panning)

Controls
--------
SPACE - Oscillator ON/OFF

ESC - All OFF

Double clicking a slider will set it to default value.

Roadmap
-------

#### Controls
keyboard piano keys

#### Manual
Usage tutorial

#### Oscillator
Envelope (Attack, Decay, Sustain, Release)
https://github.com/gre/zound-live/blob/master/app/assets/javascripts/modules/SimpleFM.js

#### Waveshaper
Wave shapes
https://github.com/Dinahmoe/tuna/blob/master/tuna.js

#### Oscillator waveshaper
PeriodicWaveNode
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.createPeriodicWave

#### Web MIDI API
http://webaudio.github.io/web-midi-api/

#### Reverb impulses
http://www.voxengo.com/impulses/

More
----

#### Web Audio API
http://webaudio.github.io/web-audio-api/
http://docs.webplatform.org/wiki/apis/webaudio
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

#### Music DSP
http://musicdsp.org/

Development notes
-----------------

#### App Dependencies
jQuery 2+

#### Prerequirements
Node.js

#### Getting started
Install dependencies
```
npm install -g gulp
npm install
```

Run build command
```
gulp
```

Open local development server at [http://localhost:4567](http://localhost:4567)
```
gulp watch
```
