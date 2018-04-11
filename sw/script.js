var button = document.getElementById("submit");
var outDiv = document.getElementById("output");
var latexBox = document.getElementById("latexOut");

var sw = function() {
    var s = document.getElementById("s").value.toUpperCase();
    var t = document.getElementById("t").value.toUpperCase();
    var ma = parseFloat(document.getElementById("ma").value);
    var mm = parseFloat(document.getElementById("mm").value);
    var o = parseFloat(document.getElementById("o").value);
    var e = parseFloat(document.getElementById("e").value);
    if (s.length > 0 && t.length > 0) {
		var cols = s.length;
		var rows = t.length;
		var table = [];
		for (var i=-1; i<rows; i++) {
		    table.push(Array(cols+1).fill(0));
		}
		var gaps = [];
		for (var i=-1; i<rows; i++) {
		    gaps.push(Array(cols+1).fill(false));
		}
		var parents = [];
		for (var i=-1; i<rows; i++) {
		    parents.push(Array(cols+1).fill(0));
		}
		for (var col=1; col<=cols; col++) {
		    for (var r=1; r<=rows; r++) {
				var a = table[r-1][col-1];
				var b = table[r-1][col];
				var c = table[r][col-1];
				if (s[col-1] == t[r-1]) {
				    a += ma;
				}
				else {
				    a += mm;
				}
				//console.log(b);
				if (gaps[r-1][col]) {
				    b += e;
				}
				else {
				    b += o;
				}
				//console.log(b);
				//console.log("\n");
				if (gaps[r][col-1]) {
				    c += e;
				}
				else {
				    c += o;
				}
				var res = Math.max(a,b,c,0);
				parentVal = 0;
				if (res==a) {parentVal += 4;}
				if (res==b) {parentVal += 2; gaps[r][col] = true;}
				if (res==c) {parentVal += 1; gaps[r][col] = true;}
				if (res==0) {parentVal = 0};
				table[r][col] = res;
				parents[r][col] = parentVal;
		    }
		}
		
		output = "<table>";
		output += "<tr><td></td><td></td>";
		for (var c=0; c<cols; c++) {
		    output += "<td>"+s[c]+"</td>";
		}
		output += "</tr>";
		for (var r=0; r<rows+1; r++) {
		    output += "<tr>";
		    if (r == 0) {
			output += "<td></td>";
		    }
		    else {
			output += "<td>"+t[r-1]+"</td>";
		    }
		    for (var c=0; c<cols+1; c++) {
			output += "<td>"+table[r][c]+"</td>";
		    }
		    output += "</tr>";
		}
		output += "</table>";
		outDiv.innerHTML = output;

		var latexTable = "\\begin{tikzpicture}\n\\matrix (mat) [table]{\n & ";
		for (var c=0; c<cols; c++) {
		    latexTable += "& "+s[c]+" ";
		}
		latexTable += "\\\\\n";
		for (var r=0; r<rows+1; r++) {
		    if (r == 0) {
			latexTable += " ";
		    }
		    else {
			latexTable += t[r-1]+" ";
		    }
		    for (var c=0; c<cols+1; c++) {
			latexTable += "& "+table[r][c]+" ";
		    }
		    latexTable += "\\\\\n";
		}
		latexTable += "};\n";
		latexTable += "\\foreach \\x in {1,...,"+(rows+1)+"} {\n"
		latexTable += "\t\\draw\n"
		latexTable += "\t([xshift=-.5\\pgflinewidth]mat-\\x-1.south west) --\n"  
		latexTable += "\t([xshift=-.5\\pgflinewidth]mat-\\x-"+(cols+2)+".south east);\n"
		latexTable += "}\n"
		latexTable += "\\foreach \\x in {1,...,"+(cols+1)+"} {\n"
		latexTable += "\t\\draw\n"
		latexTable += "\t([yshift=.5\\pgflinewidth]mat-1-\\x.north east) --\n"  
		latexTable += "\t([yshift=.5\\pgflinewidth]mat-"+(rows+2)+"-\\x.south east);\n"
		latexTable += "}\n";
		latexTable += "\\begin{scope}[shorten >= 7pt, shorten <= 7pt]\n";
		for (var col=1; col<=cols; col++) {
			for (var r=1; r<=rows; r++) {
				arrowVal = parents[r][col];
				if (arrowVal & 4) {latexTable += "\\draw[->]  (mat-"+(r+2)+"-"+(col+2)+".center) -- (mat-"+(r+1)+"-"+(col+1)+".center);\n";}
				if (arrowVal & 2) {latexTable += "\\draw[->]  (mat-"+(r+2)+"-"+(col+2)+".center) -- (mat-"+(r+1)+"-"+(col+2)+".center);\n";}
				if (arrowVal & 1) {latexTable += "\\draw[->]  (mat-"+(r+2)+"-"+(col+2)+".center) -- (mat-"+(r+2)+"-"+(col+1)+".center);\n";}
			
				//if (arrowVal & 4) {latexTable += "\\draw[->]  (mat-"+(col+2)+"-"+(r+2)+".center) -- (mat-"+(col+1)+"-"+(r+1)+".center);\n";}
				//if (arrowVal & 2) {latexTable += "\\draw[->]  (mat-"+(col+2)+"-"+(r+2)+".center) -- (mat-"+(col+2)+"-"+(r+1)+".center);\n";}
				//if (arrowVal & 1) {latexTable += "\\draw[->]  (mat-"+(col+2)+"-"+(r+2)+".center) -- (mat-"+(col+1)+"-"+(r+2)+".center);\n";}
			}
		}
		latexTable += "\\end{scope}\n\\end{tikzpicture}";

		//console.log(latexTable);
		//console.log(parents);
		latexBox.value=latexTable;
	}
}

button.addEventListener("click", sw);