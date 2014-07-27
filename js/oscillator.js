/*
 * Oscillator
 */
var Oscillator = (function() {
	'use strict';

	var osc = {
		id: 'oscillator',
		waveTypes: ['sine','square','sawtooth','triangle'],
		attack: 0.1, // range 0 to 4
		sustain: 0 // range 0 to 1
	};
	var isPlaying = false;
	
	osc.create = function(context) {
		osc.context = context;
		osc.modOscillatorNode = osc.context.createOscillator();
		osc.modGainNode = osc.context.createGain();
		osc.carrierOscillatorNode = osc.context.createOscillator();
		osc.carrierGainNode = osc.context.createGain();
		
		osc.modOscillatorNode.connect(osc.modGainNode);
		osc.modGainNode.connect(osc.carrierOscillatorNode.frequency);
		osc.carrierOscillatorNode.connect(osc.carrierGainNode);
		osc.firstNode = osc.modOscillatorNode;
		osc.lastNode = osc.carrierGainNode;
		return osc;
	};
	
	osc.connect = function(destination) {
		osc.destination = destination;
		osc.lastNode.connect(osc.destination);
	};
	
	osc.disconnect = function() {
		osc.lastNode.disconnect();
	};
	
	osc.play = function(modType, carrierType, modFrequency, carrierFrequency, modDetune, modGain, carrierGain) {
		if (!isPlaying) {
			osc.modOscillatorNode = osc.context.createOscillator();
			osc.modOscillatorNode.type = modType;
			osc.modOscillatorNode.frequency.value = modFrequency;
			osc.modOscillatorNode.detune.value = modDetune;
			
			osc.modGainNode = osc.context.createGain();
			osc.modGainNode.gain.value = modGain;
			
			osc.carrierOscillatorNode = osc.context.createOscillator();
			osc.carrierOscillatorNode.type = carrierType;
			osc.carrierOscillatorNode.frequency.value = carrierFrequency;
			
			osc.carrierGainNode = osc.context.createGain();
			osc.carrierGainNode.gain.cancelScheduledValues(osc.context.currentTime);
            osc.carrierGainNode.gain.setValueAtTime(0, osc.context.currentTime);
            osc.carrierGainNode.gain.linearRampToValueAtTime(carrierGain, osc.context.currentTime + osc.attack);
            //osc.carrierGainNode.gain.linearRampToValueAtTime(0, osc.context.currentTime + osc.sustain);
			
			osc.modOscillatorNode.connect(osc.modGainNode);
			osc.modGainNode.connect(osc.carrierOscillatorNode.frequency);
			osc.carrierOscillatorNode.connect(osc.carrierGainNode);
			osc.firstNode = osc.modOscillatorNode;
			osc.lastNode = osc.carrierGainNode;
			
			osc.modOscillatorNode.start(0);
			osc.carrierOscillatorNode.start(0);
			isPlaying = true;
		}
	};
	
	osc.stop = function() {
		if (isPlaying) {
			osc.carrierGainNode.gain.value = 0;
			osc.modOscillatorNode.stop(0);
			osc.carrierOscillatorNode.stop(0);
			osc.modOscillatorNode = null;
			osc.modGainNode = null;
			osc.carrierOscillatorNode = null;
			osc.carrierGainNode = null;
			isPlaying = false;
		}
	};
	
	osc.updateModType = function(type) {
		osc.modOscillatorNode.type = osc.waveTypes[type-1];
	};
	
	osc.updateModFrequency = function(frequency) {
		osc.modOscillatorNode.frequency.value = frequency;
	};
	
	osc.updateModDetune = function(detune) {
		osc.modOscillatorNode.detune.value = detune;		
	};
	
	osc.updateModGain = function(gain) {
		osc.modGainNode.gain.value = gain;
	};
	
	osc.updateCarrierType = function(type) {
		osc.carrierOscillatorNode.type = osc.waveTypes[type-1];
	};
	
	osc.updateCarrierFrequency = function(frequency) {
		osc.carrierOscillatorNode.frequency.value = frequency;
	};
	
	osc.updateCarrierGain = function(gain) {
		osc.carrierGainNode.gain.value = gain;
	};
	
	return osc;
	
})();