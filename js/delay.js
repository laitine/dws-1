/*
 * Delay
 */
var Delay = (function() {
	'use strict';

	var dly = {
		id: 'delay'
	};
	var maxDelayTime = 3.0;
	
	dly.create = function(context) {
		dly.context = context;
		dly.levelNode = dly.context.createGain();
		dly.delayNode = dly.context.createDelay(maxDelayTime);
		dly.delayNode.delayTime.value = 0.5;
		dly.delayGainNode = dly.context.createGain();
		dly.delayGainNode.gain.value = 0.5;
		
		dly.levelNode.connect(dly.delayNode);
		dly.delayNode.connect(dly.delayGainNode);
		dly.delayGainNode.connect(dly.levelNode);
		dly.firstNode = dly.levelNode;
		dly.lastNode = dly.levelNode;
		return dly;
	};
	
	dly.connect = function(destination) {
		dly.destination = destination;
		dly.lastNode.connect(dly.destination);
	};
	
	dly.disconnect = function() {
		dly.lastNode.disconnect();
	};
	
	dly.updateLevel = function(level) {
		dly.levelNode.gain.value = level;
	};
	
	dly.updateTime = function(time) {
		dly.delayNode.delayTime.value = time;
	};
	
	dly.updateGain = function(gain) {
		dly.delayGainNode.gain.value = gain;
	};
	
	return dly;
	
})();