var NUMFRAMES = 41;
var NP = 151;
var scaleslider = document.getElementById("x2range");
var dpdfplot = document.getElementById("dpdfplot");

var dpdf_numframe = 0;
var dpdf_currentframe = 0;
scaleslider.oninput = function() {
	//now we need to round the value to the nearest frame
	//min -> frame 0
	//max -> frame numframes-1
	dpdf_numframe = Math.round((NP-1)*(this.value - this.min)/(this.max - this.min));
	console.log(dpdf_numframe);
	if (dpdf_numframe != dpdf_currentframe) {
		dpdf_currentframe = dpdf_numframe;
		dpdfplot.src = `./framedata/${NP}/n_p${NP}_dpdfratioslice${dpdf_currentframe}.png`;
	}
}