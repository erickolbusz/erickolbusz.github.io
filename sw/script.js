var button = document.getElementById("submit");
var outDiv = document.getElementById("output");

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
				console.log(b);
				if (gaps[r-1][col]) {
				    b += e;
				}
				else {
				    b += o;
				}
				console.log(b);
				console.log("\n");
				if (gaps[r][col-1]) {
				    c += e;
				}
				else {
				    c += o;
				}
				var res = Math.max(a,b,c,0);
				if (res==b || res==c) {
				    gaps[r][col] = true;
				}
				table[r][col] = res;
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
    }
}

button.addEventListener("click", sw);