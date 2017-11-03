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

var changeData = function(i) {
	var s = data[i].name + "<a href=\""+ data[i].url + "\"><img class=\"proj-git\" src=\"GitHub-Mark-120px-plus.png\"></img></a>";
	document.getElementById("tempName").innerHTML = s;
	document.getElementById("tempDesc").innerHTML = data[i].desc;

}
var setup = function(proj) {
	//var projId = proj.id;
	//console.log(projId, data[projId], data[projId].name);
	proj.onmouseover = function() {
		//console.log("e");
		changeData(proj.id);
	}
	/*proj.onclick = function() {
		//console.log("e");
		changeData(proj.id);
	}*/
}

var table = document.getElementById("projTable");
var rows = table.children[0].children;
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
changeData(firstProj.id);
/*
				<div class="project">
					<p class="proj-name" id="tempName">
					</p>
					<hr class="proj-hr" />
					<p class="proj-text" id="tempDesc">
						Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test. Test.
					</p>
				</div>*/

