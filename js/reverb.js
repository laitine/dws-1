/*
 * Reverb
 */
var Reverb = (function() {
	'use strict';
	
	var rvb = {
		id: 'reverb',
		time: 3,
		decay: 2,
		reverse: false
	};
	
	rvb.create = function(context) {
		rvb.context = context;
		rvb.convolverNode = rvb.context.createConvolver();
		shapeImpulse();
		
		rvb.firstNode = rvb.convolverNode;
		rvb.lastNode = rvb.convolverNode;
		return rvb;
	};
	
	rvb.connect = function(destination) {
		rvb.destination = destination;
		rvb.lastNode.connect(rvb.destination);
	};
	
	rvb.disconnect = function() {
		rvb.lastNode.disconnect();
	};
	
	rvb.updateTime = function(time) {
		rvb.time = time;
		shapeImpulse();
	};
	
	rvb.updateDecay = function(decay) {
		rvb.decay = decay;
		shapeImpulse();
	};
	
	rvb.updateReverse = function(reverse) {
		rvb.reverse = reverse;
		shapeImpulse();
	};
	
	function shapeImpulse() {
		var rate = rvb.context.sampleRate,
			length = rate * rvb.time,
			decay = rvb.decay,
			impulse = rvb.context.createBuffer(2, length, rate),
			impulseL = impulse.getChannelData(0),
			impulseR = impulse.getChannelData(1);
			
	    for (var i = 0; i < length; i++) {
	    	var n = rvb.reverse ? length - i : i;
	        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
	        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
	    }

		rvb.convolverNode.buffer = impulse;
	}
	
	return rvb;
	
})();