//to do: generate table from data array
var data = {
	"projShellerino": {
		name: "Shellerino",
		url: "https://github.com/erickolbusz/Shellerino",
		desc: "The least user-friendly shell of all time, written in C."
	},
	"projChess": {
		name: "Python Lisp Chess",
		url: "https://github.com/erickolbusz/Python-Lisp-Chess",
		desc: "Local multiplayer chess written in completely vanilla Python and hosted with cgi-bin."
	},
	"projGraphics": {
		name: "Graphics Engine",
		url: "https://github.com/erickolbusz/graphics_final",
		desc: "3D graphics drawing and animation engine written in Python."
	},
	"projSoftDev": {
		name: "Stuy SoftDev",
		url: "https://github.com/erickolbusz/softdev",
		desc: "Compilation of various projects from senior year Software Development at Stuyvesant High School."
	},
	"projstoPP": {
		name: "stoPProcrastinating",
		url: "https://github.com/erickolbusz/stoPProcrastinating",
		desc: "Background process that kills any distracting programs until a certain amount of time has been spent working."
	},
	"projSW": {
		name: "Smith-Waterman Tracer",
		url: "https://github.com/erickolbusz/erickolbusz.github.io/tree/master/sw",
		desc: "Affine-gap Smith-Waterman algorithm visualizer with full LaTeX output. Live at /sw/sw.html."
	}
};

var setup = function(proj) {
	proj.onmouseover = function() {
		document.getElementById("tempName").innerHTML = data[proj.id].name;
		document.getElementById("tempDesc").innerHTML = data[proj.id].desc;
	}
	proj.onclick = function() {
		window.location = data[proj.id].url;
	}
}

var table = document.getElementById("projTable");
var rows = table.children[0].children;
console.log(rows);
var firstProj = null;
for (var i=0; i<rows.length; i++) {
	var cells = rows[i].children;
	for (var j=0; j<cells.length; j++) {
		var proj = cells[j].children[0];
		setup(proj);
		if (i==0 && j==0) {
			firstProj = proj;
		}
	}
}

//default to first project
document.getElementById("tempName").innerHTML = data[firstProj.id].name;
document.getElementById("tempDesc").innerHTML = data[firstProj.id].desc;