/*
 * Router
 */
var Router = (function() {
	'use strict';
	
	var ctx;
	var nodes = [];
	var activated = [];
	
	
	var setup = function(context, sources) {
		ctx = context;
		nodes = sources;
		activated = new Array(nodes.length);
		
		for (var i = 0; i < activated.length; i++) {
			activated[i] = false;
		}
				
		// Initial routing
		nodes[0].connect(nodes[6].firstNode);
		activated[0] = true;
		nodes[6].connect(nodes[7].firstNode);
		activated[6] = true;
		nodes[7].connect(ctx.destination);
		activated[7] = true;
	};
	
	var route = function(source) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].id === source.id) {
				var ends = locateEndpoints(i);
				
				nodes[i].create(ctx);
				nodes[ends.input].disconnect();
				nodes[ends.input].connect(nodes[i].firstNode);
				nodes[i].connect(nodes[ends.output].firstNode);
				activated[i] = true;
				break;
			}
		}
	};
	
	var rerouteOsc = function() {
		var ends = locateEndpoints(0);
		nodes[0].disconnect();
		nodes[0].connect(nodes[ends.output].firstNode);
	};
	
	var unroute = function(source) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].id === source.id) {
				var ends = locateEndpoints(i);
				
				nodes[ends.input].disconnect();
				nodes[i].disconnect();
				nodes[ends.input].connect(nodes[ends.output].firstNode);
				activated[i] = false;
				break;
			}
		}
	};
	
	function locateEndpoints(nodeIndex) {
		var ends = {
			input: 0,
			output: 0
		};
		
		for (var j = nodeIndex-1; j >= 0; j--) {
			if (activated[j]) {
				ends.input = j;
				break;
			}
		}
		
		for (var k = nodeIndex+1; k < activated.length; k++) {
			if (activated[k]) {
				ends.output = k;
				break;
			}
		}
				
		return ends;
	}
	
	return {
		setup: setup,
		route: route,
		rerouteOsc: rerouteOsc,
		unroute: unroute
	};
	
})();