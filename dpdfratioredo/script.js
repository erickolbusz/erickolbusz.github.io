var NUMFRAMES = 201;
var NP = 201;
var scaleslider = document.getElementById("x2range");
var dpdfplot = document.getElementById("dpdfplot");
var hider = document.getElementById("plothide");

var dpdf_numframe = 0;
var dpdf_currentframe = 0;

var currentname = './framedata/201/201_dpdfratio_slice0.png'

scaleslider.oninput = function() {
	//now we need to round the value to the nearest frame
	//min -> frame 0
	//max -> frame numframes-1
	dpdf_numframe = Math.round((NP-1)*(this.value - this.min)/(this.max - this.min));
	console.log(dpdf_numframe);
	if (dpdf_numframe != dpdf_currentframe) {
		dpdf_currentframe = dpdf_numframe;
		if (hider.checked) {
			dpdfplot.src = `./framedata/${NP}/${NP}_dpdfratioclean_slice${dpdf_currentframe}.png`;
		}
		else {
			dpdfplot.src = `./framedata/${NP}/${NP}_dpdfratio_slice${dpdf_currentframe}.png`;
		}
	}
}

hider.onchange = function() {
	dpdf_currentframe = Math.round((NP-1)*(scaleslider.value - scaleslider.min)/(scaleslider.max - scaleslider.min));
	if (this.checked) {
		dpdfplot.src = `./framedata/${NP}/${NP}_dpdfratioclean_slice${dpdf_currentframe}.png`;
	}
	else {
		dpdfplot.src = `./framedata/${NP}/${NP}_dpdfratio_slice${dpdf_currentframe}.png`;
	}
}