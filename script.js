var data = {
	"projShellerino": {
		name: "Shellerino",
		url: "https://github.com/erickolbusz/Shellerino",
		desc: "my name jeff"
	},
	"projChess": {
		name: "Python Lisp Chess",
		url: "https://github.com/erickolbusz/Python-Lisp-Chess",
		desc: "asdasd"
	},
	"projGraphics": {
		name: "Graphics Engine",
		url: "https://github.com/erickolbusz/",
		desc: "ssss"
	},
	"projDonger": {
		name: "Donger Creator",
		url: "https://github.com/erickolbusz/",
		desc: "eee"
	},
	"projFind": {
		name: "Find the Donger",
		url: "https://github.com/erickolbusz/",
		desc: "awdqqrrfrf"
	}
};

/*
	"proj": {
		name: "",
		url: "https://github.com/erickolbusz/",
		desc: ""
	}
*/

var setup = function(proj) {
	var projId = proj.id;
	console.log(projId, data[projId], data[projId].name);
	proj.onmouseover = function() {
		console.log("e");
		var s = data[projId].name + "<a href=\""+ data[projId].url + "\"><img class=\"proj-git\" src=\"GitHub-Mark-120px-plus.png\"></img></a>";
		document.getElementById("tempName").innerHTML = s;
		document.getElementById("tempDesc").innerHTML = data[projId].desc;
	}
}

var table = document.getElementById("projTable");
var rows = table.children[0].children;
for (var i=0; i<rows.length; i++) {
	var cells = rows[i].children;
	for (var j=0; j<cells.length; j++) {
		var proj = cells[j].children[0];
		setup(proj);
	}
}
