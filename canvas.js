var canvas = document.getElementById("canvas");
window.addEventListener("keydown", keyPressed);

canvas.width = window.innerWidth * 0.5;
canvas.height = window.innerHeight * 0.975;
var ctx = canvas.getContext("2d");

var H,W,M; //height, width, min of the two
W = canvas.width;
H = canvas.height;
(W > H) ? M=H : M=W;

//angles
var XT = Math.PI/-18;
var YT = 0;
var ZT = 0;

//position of box (r=0 g=1 b=2 y=3)
var ROW = 0;
var BOXLEVEL = 0;
var COLORS = ["#db0808", "#08db08", "#086ddb", "#dbdb08"];
var NOTES = [];

//not typing Math 90000 times
var cos = Math.cos;
var sin = Math.sin;

//color screen black
ctx.beginPath();
ctx.rect(0,0,W,H);
ctx.fill();


//ROTATION MATRICES ------------------------------------------------------------------------------
var matrixMul = function(m1, m2) {
	var ret = [];
	for (var i=0; i<m1.length; i++) {
		ret[i] = [];
		for (var j=0; j<m2[0].length; j++) {
			var s = 0;
			for (var k=0; k<m1[0].length; k++) {
				s += m1[i][k]*m2[k][j];
			}
			ret[i][j] = s;
		}
	}
	return ret;
}

var rotX = function(theta) {
	return [[1,0,0,0],
			[0,cos(theta),sin(theta),0],
			[0,-1*sin(theta),cos(theta),0],
			[0,0,0,1]];
}
var rotY = function(theta) {
	return [[cos(theta),0,-1*sin(theta),0],
			[0,1,0,0],
			[sin(theta),0,cos(theta),0],
			[0,0,0,1]];
}
var rotZ = function(theta) {
	return [[cos(theta),sin(theta),0,0],
			[-1*sin(theta),cos(theta),0,0],
			[0,0,1,0],
			[0,0,0,1]];
}
//camera matrix
var camRot = function(cx,cy,cz,ct) {
	return [[1,0,0,0],
			[0,cos(ct),-1*sin(ct),0],
			[0,sin(ct),cos(ct),0],
			[-1*cx,-1*(cy*cos(ct)+cz*sin(ct)),cy*sin(ct)-cz*cos(ct),1]];
}
var camera = camRot(0,-2,-5,Math.PI/18);


//PLOTTING ------------------------------------------------------------------------------
var clearScreen = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("cleared");
    ctx.beginPath();
    ctx.rect(0,0,W,H);
    ctx.fill();
}

var plotLine = function(x1, y1, z1,
						x2, y2, z2,
						xtheta, ytheta, ztheta) {
	var r = -0.0025;
	var rot = matrixMul(matrixMul(rotX(xtheta),rotY(ytheta)),rotZ(ztheta));

	//rotating
	var p1 = matrixMul([[x1, y1, z1, 1]],rot);
	var p2 = matrixMul([[x2, y2, z2, 1]],rot);

	//1pp
	var xa = p1[0][0]/(r*p1[0][2]+1);
	var ya = p1[0][1]/(r*p1[0][2]+1);
	var xb = p2[0][0]/(r*p2[0][2]+1);
	var yb = p2[0][1]/(r*p2[0][2]+1);

	//drawing
	ctx.beginPath();
	ctx.moveTo((0.5+0.01*xa)*W, (0.5+0.01*ya)*H);
	ctx.lineTo((0.5+0.01*xb)*W, (0.5+0.01*yb)*H);
	ctx.stroke();
}

//circle in x-z plane
var plotCircle = function(cx, cy, cz, r,
						  xtheta, ytheta, ztheta) {
	var points = [];
	var n = 100;
	for (var i=0; i<n; i++) {
		var t1 = Math.PI*2*(i-1)/n;
		var t2 = Math.PI*2*i/n;
		plotLine(cx+r*cos(t1), cy, cz+r*sin(t1),
				 cx+r*cos(t2), cy, cz+r*sin(t2),
				 xtheta, ytheta, ztheta);
	}
}

//rectangle
var plotRect = function(x1, y1, z1,
						x2, y2, z2,
						xtheta, ytheta, ztheta) {
	plotLine(x1, y1, z1,  x1, y1, z2,  xtheta, ytheta, ztheta);
	plotLine(x1, y1, z2,  x2, y1, z2,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z2,  x2, y1, z1,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z1,  x1, y1, z1,  xtheta, ytheta, ztheta);
}

//rectangular prism
var plotRectPrism = function(x1, y1, z1,
						x2, y2, z2,
						xtheta, ytheta, ztheta) {
	plotLine(x1, y1, z1,  x1, y1, z2,  xtheta, ytheta, ztheta);
	plotLine(x1, y1, z2,  x2, y1, z2,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z2,  x2, y1, z1,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z1,  x1, y1, z1,  xtheta, ytheta, ztheta);

	plotLine(x1, y2, z1,  x1, y2, z2,  xtheta, ytheta, ztheta);
	plotLine(x1, y2, z2,  x2, y2, z2,  xtheta, ytheta, ztheta);
	plotLine(x2, y2, z2,  x2, y2, z1,  xtheta, ytheta, ztheta);
	plotLine(x2, y2, z1,  x1, y2, z1,  xtheta, ytheta, ztheta);

	plotLine(x1, y1, z1,  x1, y2, z1,  xtheta, ytheta, ztheta);
	plotLine(x1, y1, z2,  x1, y2, z2,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z2,  x2, y2, z2,  xtheta, ytheta, ztheta);
	plotLine(x2, y1, z1,  x2, y2, z1,  xtheta, ytheta, ztheta);
}

//bigbox
var drawBigBox = function() {
	ctx.strokeStyle = "#aaaaaa";
	plotRectPrism(-25, 0, -10,
		 25, 40, 0,
		 XT, YT, ZT);
}

//small box
var drawSmallBox = function() {
	ctx.strokeStyle = COLORS[ROW];
	plotRectPrism(-25, BOXLEVEL, -10,
		 25, BOXLEVEL+10, 0,
		 XT, YT, ZT);
}

//tracks
var drawTracks = function() {
	ctx.strokeStyle = "#aaaaaa";
    for (var i=-20; i<=20; i+=10) {
		plotLine(i,BOXLEVEL+5,0,i,0,-1000,XT,YT,ZT);
    }
    plotLine(-20,BOXLEVEL+5,0,20,BOXLEVEL+5,0,XT,YT,ZT);
}

var drawNotes = function() {
	var note;
	for (var i=0; i<NOTES.length; i++) {
		note = NOTES[i];
		ctx.strokeStyle = COLORS[note.row];
		//drawing circles on a angled plane,,,,,,
		//lol pretend that all notes are rectangles for now
		//z-thickness is 10 i.e. [note.z-5, note.z+5]
		x1 = 10*note.col-20;
		x2 = 10*note.col-10;
		z1 = note.z-5;
		z2 = note.z+5;
		y1 = (BOXLEVEL+5)*(1-z1/-1000);
		y2 = (BOXLEVEL+5)*(1-z2/-1000);
		plotRect(x1,y1,z1, x2,y2,z2, XT,YT,ZT);
	}
}

var drawAll = function() {
    drawTracks();
	drawNotes();
    drawBigBox();
    drawSmallBox();
}


//ANIMATION ------------------------------------------------------------------------------
var rowDown = function() {
    if (ROW < 3) {
		ROW++; //needs to be INSTANT so people don't get screwed by animation	
		//todo later: rewrite with the fps of the whole program
		var STEPS = 20;
		var MS = 20;
		var anim = setInterval(function() {
		    clearScreen();
		    BOXLEVEL += 10/STEPS;
		    drawAll();
		    if (BOXLEVEL - ROW*10 > -0.0001) {
		    	clearInterval(anim);
		    }
		},MS/STEPS);
    }
}

var rowUp = function() {
    if (ROW > 0) {
		ROW--; //needs to be INSTANT so people don't get screwed by animation	
		//todo later: rewrite with the fps of the whole program
		var STEPS = 20;
		var MS = 20;
		var anim = setInterval(function() {
		    clearScreen();
		    BOXLEVEL -= 10/STEPS;
		    drawAll();
		    if (BOXLEVEL - ROW*10 < 0.0001) {
		    	clearInterval(anim);
		    }
		},MS/STEPS);
    }
}


//INPUT ------------------------------------------------------------------------------
function keyPressed(e) {
	console.log(e.keyCode);
    if (e.keyCode == 16) {
		if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
		    console.log("LSHIFT");
		    rowUp();
		}
		else if (e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
		    console.log("RSHIFT");
		    rowDown();
		}
    }
    else if (e.keyCode == 68) {
		console.log("D");
    }
    else if (e.keyCode == 70) {
		console.log("F");
    }
    else if (e.keyCode == 74) {
		console.log("J");
    }
    else if (e.keyCode == 75) {
		console.log("K");
    }    
    else if (e.keyCode == 220) {
    	//just testing stuff lol
		console.log("\\");
		var STEPS = 360;
		var MS = 500;
		ZT = -2*Math.PI;
		var anim = setInterval(function() {
		    clearScreen();
		    ZT += 2*Math.PI/STEPS;
		    drawAll();
		    if (ZT > -0.0001) {
		    	ZT = 0;
		    	clearInterval(anim);
		    }
		},MS/STEPS);
    }
}


//PARSING ------------------------------------------------------------------------------
var parseTrack = function(track) {
	//track is split into array of notes
	var notes = track.split("|");
	var note = [];
	for(var i=0; i<notes.length; i++) {
		//notes split into array that has the properties of each single note
		note[i] = notes[i].split(",");
	}
	return note;
}

var playTrack = function(notes) {
	//each note is an array of properties 
	// 1) where note will be, left mid-left mid-right right (1-4)
	// 2) which row it will be, based on color, red green blue yellow (r g b y)
	// 3) time the note will come (min:sec)
	for(var i=0; i<notes.length; i++) {
		for(var j=0; j<notes[i].length; j++) {
			console.log(notes[i][j]);
		}
		console.log("--------");
	}
}


//TEST CODE ------------------------------------------------------------------------------

var createNote = function(r, c, z) {
	NOTES.push({row:r, col:c, z:z});
}

for (var i=0; i>=-1000; i-=100) {
	createNote((i/-100)%4,0,i);
}

//var n = "1,y,0:01|2,y,0:23|2,g,0:24|4,b,0:40"
//console.log(parseTrack(n));
//playTrack(parseTrack(n));

drawBigBox();
drawTracks();
drawSmallBox();
drawNotes();

var a = [[1,0],[0,-3/2]];
var b = [[1,-2],[0,1]];
var c = [[1,0],[-1,1]];
var d = [[1/3,0],[0,1]];
var e = [[1,0],[2,1]];

var f = matrixMul(a,b);
var g = matrixMul(c,d);
var h = matrixMul(f,g);
console.log(f,g,h);
