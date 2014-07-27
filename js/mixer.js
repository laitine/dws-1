/*
 * Mixer
 */
var Mixer = (function() {
	'use strict';

	var mxr = {
		id: 'mixer'
	};
	var lowEq = 200;
	var middleEq = 1000;
	var highEq = 2000;
	
	mxr.create = function(context) {
		mxr.context = context;
		
		// Equalizer
		mxr.lowFilterNode = mxr.context.createBiquadFilter();
		mxr.lowFilterNode.type = 'lowshelf';
		mxr.lowFilterNode.frequency.value = lowEq;
		mxr.middleFilterNode = mxr.context.createBiquadFilter();
		mxr.middleFilterNode.type = 'peaking';
		mxr.middleFilterNode.frequency.value = middleEq;
		mxr.highFilterNode = mxr.context.createBiquadFilter();
		mxr.highFilterNode.type = 'highshelf';
		mxr.highFilterNode.frequency.value = highEq;
		
		// Panner
		mxr.channelMergerNode = mxr.context.createChannelMerger(2);
		mxr.pannerNode = mxr.context.createPanner();
		mxr.pannerNode.panningModel = 'equalpower';
		
		// Volume
		mxr.levelNode = mxr.context.createGain();
		
		mxr.lowFilterNode.connect(mxr.middleFilterNode);
		mxr.middleFilterNode.connect(mxr.highFilterNode);
		mxr.highFilterNode.connect(mxr.channelMergerNode, 0, 0);	
		mxr.highFilterNode.connect(mxr.channelMergerNode, 0, 1);
		mxr.channelMergerNode.connect(mxr.pannerNode);
		mxr.pannerNode.connect(mxr.levelNode);
		mxr.firstNode = mxr.lowFilterNode;
		mxr.lastNode = mxr.levelNode;
		return mxr;
	};
	
	mxr.connect = function(destination) {
		mxr.destination = destination;
		mxr.lastNode.connect(mxr.destination);
	};
	
	mxr.updateLow = function(low) {
		mxr.lowFilterNode.gain.value = low;
	};
	
	mxr.updateMiddle = function(middle) {
		mxr.middleFilterNode.gain.value = middle;
	};
	
	mxr.updateHigh = function(high) {
		mxr.highFilterNode.gain.value = high;
	};
	
	mxr.updatePanner = function(pan) {
		mxr.pannerNode.setPosition(pan, 0, 0);
	};
	
	mxr.updateVolume = function(volume) {
		mxr.levelNode.gain.value = volume;
	};
	
	return mxr;
	
})();