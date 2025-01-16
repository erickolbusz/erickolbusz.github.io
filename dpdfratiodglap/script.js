var NUMFRAMES = 201;
var NP = 201;
var scaleslider = document.getElementById("x2range");
var dpdfplot = document.getElementById("dpdfplot");

var dpdf_numframe = 0;
var dpdf_currentframe = 0;

var currentname = './framedata/201/201_dpdfratios_slice0_hq.png'

scaleslider.oninput = function() {
	//now we need to round the value to the nearest frame
	//min -> frame 0
	//max -> frame numframes-1
	dpdf_numframe = Math.round((NP-1)*(this.value - this.min)/(this.max - this.min));
	console.log(dpdf_numframe);
	if (dpdf_numframe != dpdf_currentframe) {
		dpdf_currentframe = dpdf_numframe;
		dpdfplot.src = `./framedata/${NP}/${NP}_dpdfratios_slice${dpdf_currentframe}_hq.png`;
	}
}