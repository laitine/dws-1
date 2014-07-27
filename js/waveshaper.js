/*
 * Waveshaper
 */
var Waveshaper = (function() {
	'use strict';

	var shaper = {
		id: 'waveshaper'
	};
		
	shaper.create = function(context) {
		shaper.context = context;
		shaper.gainNode = shaper.context.createGain();
		shaper.waveShaperNode = shaper.context.createWaveShaper();
		shaper.lowPassFilterNode = shaper.context.createBiquadFilter();
		shaper.lowPassFilterNode.type = 'lowpass';
		
		shaper.gainNode.connect(shaper.waveShaperNode);
		shaper.waveShaperNode.connect(shaper.lowPassFilterNode);
		shaper.firstNode = shaper.gainNode;
		shaper.lastNode = shaper.lowPassFilterNode;
		return shaper;
	};
	
	shaper.connect = function(destination) {
		shaper.destination = destination;
		shaper.lastNode.connect(shaper.destination);
	};
	
	shaper.disconnect = function() {
		shaper.lastNode.disconnect();
	};
	
	shaper.updateGain = function(gain) {
		shaper.gainNode.gain.value = gain;
	};
	
	shaper.updateCurve = function(amount) {
		var curve = shapeCurve(amount); 
		shaper.waveShaperNode.curve = curve;
	};
	
	shaper.updateTone = function(tone) {
		shaper.lowPassFilterNode.frequency.value = tone;
	};
	
	function shapeCurve(amount) {
		var k = amount * 50,
	    	nSamples = 44100,
	    	curve = new Float32Array(nSamples),
	    	deg = Math.PI / 180;
	    
	  	for (var i = 0; i < nSamples; i++) {
	    	var x = i * 2 / nSamples - 1;
	    	curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
	  	}
	  	
	  	return curve;
	}
	
	return shaper;
	
})();