/*
 * Compressor
 */
var Compressor = (function() {
	'use strict';
	
	var comp = {
		id: 'compressor'
	};
	
	comp.create = function(context) {
		comp.context = context;
		comp.dynamicsCompressorNode = comp.context.createDynamicsCompressor();
		
		comp.firstNode = comp.dynamicsCompressorNode;
		comp.lastNode = comp.dynamicsCompressorNode;
		return comp;
	};
	
	comp.connect = function(destination) {
		comp.destination = destination;
		comp.lastNode.connect(comp.destination);
	};
	
	comp.disconnect = function() {
		comp.lastNode.disconnect();
	};
	
	comp.updateAttack = function(attack) {
		comp.dynamicsCompressorNode.attack.value = attack;
	};
	
	comp.updateKnee = function(knee) {
		comp.dynamicsCompressorNode.knee.value = knee;
	};
	
	comp.updateRatio = function(ratio) {
		comp.dynamicsCompressorNode.ratio.value = ratio;
	};
	
	comp.updateReduction = function(reduction) {
		comp.dynamicsCompressorNode.reduction.value = reduction;
	};
	
	comp.updateRelease = function(release) {
		comp.dynamicsCompressorNode.release.value = release;
	};
	
	comp.updateThreshold = function(threshold) {
		comp.dynamicsCompressorNode.threshold.value = threshold;
	};
	
	return comp;
	
})();