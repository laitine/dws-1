/*
 * Spectrum analyser
 */
var Analyser = (function() {
	'use strict';

	var anlysr = {
		id: 'analyser'
	};
	
	// AnalyserNode settings
	var fftSize = 32;
	var frequencyBinCount = fftSize / 2;
	var maxDecibels = -0.01;
	var minDecibels = -200;
	var smoothingTimeConstant = 0.8;
	
	// Graph settings
	var animationFrame;
	var canvas = $('#analyser')[0];
	var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var barWidth = 12;
	var barCount = Math.round(width / barWidth);
	var byteHeightRatio = 255 / height;
	var freqByteData = new Uint8Array(frequencyBinCount);
	var gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(1,'#0B8468');
    gradient.addColorStop(0.75,'#40C46D');
    gradient.addColorStop(0.25,'#C8D621');
    gradient.addColorStop(0,'#CC1126');
    ctx.fillStyle = gradient;
	
	anlysr.create = function(context) {
		anlysr.context = context;
		anlysr.analyserNode = anlysr.context.createAnalyser();
		
		anlysr.fftSize = fftSize;
		anlysr.frequencyBinCount = frequencyBinCount;
		anlysr.maxDecibels = maxDecibels;
		anlysr.minDecibels = minDecibels;
		anlysr.smoothingTimeConstant = smoothingTimeConstant;
		
		anlysr.firstNode = anlysr.analyserNode;
		anlysr.lastNode = anlysr.analyserNode;
		return anlysr;
	};
	
	anlysr.connect = function(destination) {
		anlysr.destination = destination;
		anlysr.lastNode.connect(anlysr.destination);
	};
	
	anlysr.disconnect = function() {
		anlysr.lastNode.disconnect();
	};
	
	anlysr.startSpectrum = function() {
	    anlysr.analyserNode.getByteFrequencyData(freqByteData);
	    ctx.clearRect(0, 0, width, height);

	    for (var i = 0; i < barCount; i++) {
	        var barHeight = freqByteData[i] / byteHeightRatio;
	    	ctx.fillRect(barWidth * i, height, barWidth - 2, -barHeight);
	    }
	    
	    animationFrame = requestAnimationFrame(anlysr.startSpectrum);
	};
	
	anlysr.stopSpectrum = function() {
		ctx.clearRect(0, 0, width, height);
	   	cancelAnimationFrame(animationFrame);
	};
	
	return anlysr;

})();