$(function() {
	'use strict';

	var context = {};
	
	// Initialize context
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
		
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	} catch(e) {
		alert("This application is not supported by this browser!\n" +
			  "Currently supports <strong>Chrome</strong>");
	}
	
	// Create keyboard
	var keys = Keyboard.create();
	
	// Create nodes
	var osc = Oscillator.create(context);
	var shaper = Waveshaper.create(context);
	var crusher = Bitcrusher.create(context);
	var rvb = Reverb.create(context);
	var dly = Delay.create(context);
	var comp = Compressor.create(context);
	var mxr = Mixer.create(context);
	var anlysr = Analyser.create(context);
		
	// Route nodes
	Router.setup(context, [osc, shaper, crusher, rvb, dly, comp, mxr, anlysr]);
	
	
	/*
	 * Oscillator event listeners
	 */
	var oscOn = false;
	$('#oscillator #power').on('click', function() {
		if (!oscOn) {
			$(this).addClass('active');
			oscPlay();
			Router.rerouteOsc();
			oscOn = true;
			anlysr.startSpectrum();
		} else {
			$(this).removeClass('active');
			oscStop();
			oscOn = false;
			anlysr.stopSpectrum();
		}
	});
	
	function oscPlay() {
		osc.play($('#oscillator #modType').val(), $('#oscillator #carrierType').val(), 
					$('#oscillator #modFrequency').val(), $('#oscillator #carrierFrequency').val(),
					$('#oscillator #modDetune').val(), $('#oscillator #modGain').val(),
					$('#oscillator #carrierGain').val());
	}
	
	function oscStop() {
		osc.stop();
		osc.create(context);
	}
	
	$('#oscillator #modType').on('change', function() {
		osc.updateModType($(this).val());
	});
	
	$('#oscillator #modFrequency').on('input', function() {
		osc.updateModFrequency($(this).val());
	});
	
	$('#oscillator #modDetune').on('input', function() {
		osc.updateModDetune($(this).val());
	});
	
	$('#oscillator #modGain').on('input', function() {
		osc.updateModGain($(this).val());
	});
	
	$('#oscillator #carrierType').on('change', function() {
		osc.updateCarrierType($(this).val());
	});
	
	$('#oscillator #carrierFrequency').on('input', function() {
		osc.updateCarrierFrequency($(this).val());
	});
	
	$('#oscillator #carrierGain').on('input', function() {
		osc.updateCarrierGain($(this).val());
	});
	
	/*
	 * Waveshaper event listeners
	 */
	var shaperOn = false;
	$('#waveshaper #power').on('click', function() {
		if (!shaperOn) {
			$(this).addClass('active');
			shaperOn = true;
			Router.route(shaper);
			shaper.updateGain($('#waveshaper #gain').val());
			shaper.updateCurve($('#waveshaper #drive').val());
			shaper.updateTone($('#waveshaper #tone').val());
		} else {
			$(this).removeClass('active');
			shaperOn = false;
			Router.unroute(shaper);
		}
	});
	
	$('#waveshaper #gain').on('input', function() {
		shaper.updateGain($(this).val());
	});
	
	$('#waveshaper #drive').on('input', function() {
		shaper.updateCurve($(this).val());
	});
	
	$('#waveshaper #tone').on('input', function() {
		shaper.updateTone($(this).val());
	});
	
	/*
	 * Bitcrusher
	 */
	var crusherOn = false;
	$('#bitcrusher #power').on('click', function() {
		if (!crusherOn) {
			$(this).addClass('active');
			crusherOn = true;
			Router.route(crusher);
		} else {
			$(this).removeClass('active');
			crusherOn = false;
			Router.unroute(crusher);
		}
	});
	
	$('#bitcrusher #buffer').on('change', function() {
		crusher.updateBuffer($(this).val());
	});
	
	$('#bitcrusher #bitrate').on('input', function() {
		crusher.updateBitrate($(this).val());
	});
	
	/*
	 * Reverb event listeners
	 */
	var rvbOn = false;
	$('#reverb #power').on('click', function() {
		if (!rvbOn) {
			$(this).addClass('active');
			rvbOn = true;
			Router.route(reverb);
		} else {
			$(this).removeClass('active');
			rvbOn = false;
			Router.unroute(reverb);
		}
	});
	
	$('#reverb #time').on('input', function() {
		rvb.updateTime($(this).val());
	});
	
	$('#reverb #decay').on('input', function() {
		rvb.updateDecay($(this).val());
	});
	
	var reverseOn = false;
	$('#reverb #reverse').on('click', function() {
		if (!reverseOn) {
			$(this).addClass('active');
			reverseOn = true;
			rvb.updateReverse(reverseOn);
		} else {
			$(this).removeClass('active');
			reverseOn = false;
			rvb.updateReverse();
		}	
	});
	
	/*
	 * Delay event listeners
	 */
	var dlyOn = false;
	$('#delay #power').on('click', function() {
		if (!dlyOn) {
			$(this).addClass('active');
			dlyOn = true;
			Router.route(dly);
		} else {
			$(this).removeClass('active');
			dlyOn = false;
			Router.unroute(dly);
		}
	});
	
	$('#delay #level').on('input', function() {
		dly.updateLevel($(this).val());
	});
	
	$('#delay #time').on('input', function() {
		dly.updateTime($(this).val());
	});
	
	$('#delay #delayLevel').on('input', function() {
		dly.updateGain($(this).val());
	});
	
	/*
	 * Compressor event listeners
	 */
	var compOn = false;
	$('#compressor #power').on('click', function() {
		if (!compOn) {
			$(this).addClass('active');
			compOn = true;
			Router.route(comp);
		} else {
			$(this).removeClass('active');
			compOn = false;
			Router.unroute(comp);
		}
	});
	
	$('#compressor #attack').on('input', function() {
		comp.updateAttack($(this).val());
	});
	
	$('#compressor #knee').on('input', function() {
		comp.updateKnee($(this).val());
	});
	
	$('#compressor #ratio').on('input', function() {
		comp.updateRatio($(this).val());
	});
	
	$('#compressor #reduction').on('input', function() {
		comp.updateReduction($(this).val());
	});
	
	$('#compressor #release').on('input', function() {
		comp.updateRelease($(this).val());
	});
	
	$('#compressor #threshold').on('input', function() {
		comp.updateThreshold($(this).val());
	});
	
	/*
	 * Mixer event listeners
	 */
	$('#mixer #equalizer #low').on('input', function() {
		mxr.updateLow($(this).val());
	});
	
	$('#mixer #equalizer #middle').on('input', function() {
		mxr.updateMiddle($(this).val());
	});
	
	$('#mixer #equalizer #high').on('input', function() {
		mxr.updateHigh($(this).val());
	});
	
	$('#mixer #pan').on('input', function() {
		mxr.updatePanner($(this).val());
	});
	
	$('#mixer #volume').on('input', function() {
		mxr.updateVolume($(this).val());
	});
	
	/*
	 * Presets
	 */
	var presets = {};
	var patchSelect = $('#presets #patch');
	$.getJSON('presets.json', function(data) {
		presets = data.presets;
		var count = 1;
		for (var preset in presets) {
			patchSelect.append($("<option />").val(count).text(presets[preset].name));
			count++;
		}
	});
	
	$('#presets #patch').on('change', function() {
		var patch = presets[$(this).val()-1];
		
		$('#oscillator #modType').val(osc.waveTypes.indexOf(patch.oscillator.modType)+1);
		$('#oscillator #modFrequency').val(patch.oscillator.modFrequency);
		$('#oscillator #modDetune').val(patch.oscillator.modDetune);
		$('#oscillator #modGain').val(patch.oscillator.modGain);
		$('#oscillator #carrierType').val(osc.waveTypes.indexOf(patch.oscillator.carrierType)+1);
		$('#oscillator #carrierFrequency').val(patch.oscillator.carrierFrequency);
		$('#oscillator #carrierGain').val(patch.oscillator.carrierGain);
		if (!oscOn && patch.oscillator.power) {
			$('#oscillator #power').click();
		} else if (oscOn && patch.oscillator.power) {
			oscStop();
			oscPlay();
			Router.rerouteOsc();
		} else {
			$('#oscillator #power').click();
		}
		
		if (!shaperOn && patch.waveshaper.power || shaperOn && !patch.waveshaper.power) {
			$('#waveshaper #power').click();
		}
		$('#waveshaper #gain').val(patch.waveshaper.gain).trigger('input');
		$('#waveshaper #drive').val(patch.waveshaper.drive).trigger('input');
		$('#waveshaper #tone').val(patch.waveshaper.tone).trigger('input');
		
		if (!crusherOn && patch.bitcrusher.power || crusherOn && !patch.bitcrusher.power) {
			$('#bitcrusher #power').click();
		}
		$('#bitcrusher #buffer').val(crusher.bufferSizes.indexOf(patch.bitcrusher.buffer)+1).trigger('change');
		$('#bitcrusher #bitrate').val(patch.bitcrusher.bitrate).trigger('input');
		
		if (!rvbOn && patch.reverb.power || rvbOn && !patch.reverb.power) {
			$('#reverb #power').click();
		}
		$('#reverb #time').val(patch.reverb.time).trigger('input');
		$('#reverb #decay').val(patch.reverb.decay).trigger('input');
		if (!reverseOn && patch.reverb.reverse || reverseOn) {
			$('#reverb #reverse').click();
		}
		
		if (!dlyOn && patch.delay.power || dlyOn && !patch.delay.power) {
			$('#delay #power').click();
		}
		$('#delay #level').val(patch.delay.level).trigger('input');
		$('#delay #time').val(patch.delay.time).trigger('input');
		$('#delay #delayLevel').val(patch.delay.delayLevel).trigger('input');
		
		if (!compOn && patch.compressor.power || compOn && !patch.compressor.power) {
			$('#compressor #power').click();
		}
		$('#compressor #attack').val(patch.compressor.attack).trigger('input');
		$('#compressor #knee').val(patch.compressor.knee).trigger('input');
		$('#compressor #ratio').val(patch.compressor.ratio).trigger('input');
		$('#compressor #reduction').val(patch.compressor.reduction).trigger('input');
		$('#compressor #release').val(patch.compressor.release).trigger('input');
		$('#compressor #threshold').val(patch.compressor.threshold).trigger('input');
		
		$('#mixer #low').val(patch.mixer.low).trigger('input');
		$('#mixer #middle').val(patch.mixer.middle).trigger('input');
		$('#mixer #high').val(patch.mixer.high).trigger('input');
		$('#mixer #pan').val(patch.mixer.pan).trigger('input');
		$('#mixer #volume').val(patch.mixer.volume).trigger('input');
	});
	
	//$('#presets #patch').val(2).trigger('change');
	
	/*
	 * Click helper event listeners
	 */
	$('input').on('dblclick', function() {
		$(this).val($(this).attr('value')).trigger('input');
	});
	
	/*
	 * Controls helper event listeners
	 */
	$(window).on('keydown', function(e) {
		// Controls
		switch (e.keyCode) {
			case 32:
				$('#oscillator #power').click();
				break;
			case 27:
				if (oscOn) {
					$('#oscillator #power').click();
				}
				if (shaperOn) {
					$('#waveshaper #power').click();
				}
				if (crusherOn) {
					$('#bitcrusher #power').click();
				}
				if (rvbOn) {
					$('#reverb #power').click();
				}
				if (dlyOn) {
					$('#delay #power').click();
				}
				if (compOn) {
					$('#compressor #power').click();
				}
				break;
		}
	});
	
	/*
	 * Keyboard helper event listeners
	 */
	$(window).on('keydown', function(e) {
		//Keys
		if (e.keyCode >= 65 && e.keyCode <= 89) {
			keys.noteOn(e.keyCode);
		}
	});
		
	$(window).on('keyup', function(e) {		
		//Keys
		if (e.keyCode >= 65 && e.keyCode <= 89) {
			keys.noteOff(e.keyCode);
		}
	});
});