var NUMFRAMES = 41;
var NP = 151;
var scaleslider = document.getElementById("scalerange");
var dpdfplot = document.getElementById("dpdfplot");
var x2slider = document.getElementById("x2range");
var x1plot = document.getElementById("x1plot");

var dpdf_numframe = 0;
var dpdf_currentframe = 0;
scaleslider.oninput = function() {
	//now we need to round the value to the nearest frame
	//min -> frame 0
	//max -> frame numframes-1
	dpdf_numframe = Math.round((NUMFRAMES-1)*(this.value - this.min)/(this.max - this.min));
	if (dpdf_numframe != dpdf_currentframe) {
		dpdf_currentframe = dpdf_numframe;
		dpdfplot.src = `./framedata/${NP}/n_p${NP}_frames${NUMFRAMES}_frame${dpdf_currentframe}.png`;
	}
}

var x2_numframe = 0;
var x2_currentframe = 0;
x2slider.oninput = function() {
	x2_numframe = Math.round((NP-1)*(this.value - this.min)/(this.max - this.min));
	if (x2_numframe != x2_currentframe) {
		x2_currentframe = x2_numframe;
		x1plot.src = `./framedata/${NP}/n_p${NP}_pdfslice${x2_currentframe}.png`;
	}
}