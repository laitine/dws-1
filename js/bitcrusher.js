/*
 * Bitcrusher
 */
var Bitcrusher = (function() {
	'use strict';

	var crusher = {
		id: 'bitcrusher',
		bufferSizes: [256, 512, 1024, 2048, 4096],
		bufferSize: 2048,
		bitrate: 2, // range 1 to 16
		normFreq: 1 // range 0.0 to 1.0
	};
	var channelCount = 1;
	
	crusher.create = function(context) {
		crusher.context = context;
    	crusher.crusherNode = crusher.context.createScriptProcessor(crusher.bufferSize, channelCount, channelCount);
    	crusher.crusherNode.onaudioprocess = onProcess;
    	
    	crusher.firstNode = crusher.crusherNode;
    	crusher.lastNode = crusher.crusherNode;
    	return crusher;
   	};
   	
   	crusher.connect = function(destination) {
   		crusher.destination = destination;
   		crusher.lastNode.connect(crusher.destination);
   	};
   	
   	crusher.disconnect = function() {
   		crusher.lastNode.disconnect();
   	};
   	
   	crusher.updateBuffer = function(buffer) {
   		crusher.bufferSize = crusher.bufferSizes[buffer-1];
   	};
    
	crusher.updateBitrate = function(bitrate) {
    	crusher.bitrate = bitrate;
    };
    
    function onProcess(audioProcessingEvent) {
        var input = audioProcessingEvent.inputBuffer.getChannelData(0);
        var output = audioProcessingEvent.outputBuffer.getChannelData(0);
        var phaser = 0;
    	var last = 0;
    	var step = Math.pow(1/2, crusher.bitrate);
                
        for (var i = 0; i < crusher.bufferSize; i++) {
            phaser += crusher.normFreq;
            if (phaser >= 1.0) {
                phaser -= 1.0;
                last = step * Math.floor(input[i] / step + 0.5);
            }
            output[i] = last;
        }
    }
    
    return crusher;
    
})();