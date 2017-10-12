var canvas = document.getElementById("canvas");
window.addEventListener("keydown", keyPressed);

canvas.width = window.innerWidth * 0.5;
canvas.height = window.innerHeight * 0.975;
var ctx = canvas.getContext("2d");

//height, width, min of the two
var H,W,M;
W = canvas.width;
H = canvas.height;
(W > H) ? M=H : M=W;

//not typing Math 90000 times
var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;

//angles
var PP = -0.0025;
var XT = pi/-18;
var YT = 0;
var ZT = 0;

//position of box (r=0 g=1 b=2 y=3)
var ROW = 0;
var BOXLEVEL = 0;
var BLACK = "#000000";
var GRAY = "#aaaaaa";
var COLORS = ["#db0808", "#08db08", "#086ddb", "#dbdb08"];
var BORDERS = ["#a00303", "#03a003", "#036da0", "#a0a003"];
//var BORDERS = ["#ffffff", "#ffffff", "#ffffff", "#ffffff"];
var NOTES = [];

//line count for non-rectangular paths and polygons
var CIRCLE_N = 40;
var NOTE_CURVE_N = 6;

//animation info
var ROW_SHIFT_N = 5;
var ROW_SHIFT_T = 10;


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


//PLOTTING ------------------------------------------------------------------------------
var clearScreen = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("cleared");
    ctx.fillStyle = BLACK;
    ctx.beginPath();
    ctx.rect(0,0,W,H);
    ctx.fill();
}

var plotLine = function(x1, y1, z1,
						x2, y2, z2,
						xtheta, ytheta, ztheta) {
	var rot = matrixMul(matrixMul(rotX(xtheta),rotY(ytheta)),rotZ(ztheta));

	//rotating
	var p1 = matrixMul([[x1, y1, z1, 1]],rot);
	var p2 = matrixMul([[x2, y2, z2, 1]],rot);

	//1pp
	var xa = p1[0][0]/(PP*p1[0][2]+1);
	var ya = p1[0][1]/(PP*p1[0][2]+1);
	var xb = p2[0][0]/(PP*p2[0][2]+1);
	var yb = p2[0][1]/(PP*p2[0][2]+1);

	//drawing
	//console.log(xa,ya);
	ctx.beginPath();
	ctx.moveTo((0.5+0.01*xa)*W, (0.5+0.01*ya)*H);
	ctx.lineTo((0.5+0.01*xb)*W, (0.5+0.01*yb)*H);
	ctx.stroke();
}

//filled circle in x-z plane
var plotCircleFill = function(cx, cy, cz, r,
							  xtheta, ytheta, ztheta) {
	var points = [];
	var rot = matrixMul(matrixMul(rotX(xtheta),rotY(ytheta)),rotZ(ztheta));

	for (var i=0; i<CIRCLE_N; i++) {
		var t = pi*2*i/CIRCLE_N;
		var p = matrixMul([[cx+r*cos(t), cy, cz+r*sin(t), 1]], rot);
		points.push([p[0][0]/(PP*p[0][2]+1), p[0][1]/(PP*p[0][2]+1)]);
	}
	ctx.beginPath();
	ctx.moveTo((0.5+0.01*points[0][0])*W, (0.5+0.01*points[0][1])*H);
	for (var i=1; i<points.length; i++) {
		ctx.lineTo((0.5+0.01*points[i][0])*W, (0.5+0.01*points[i][1])*H);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

var plotRectFill = function(x1, y1, z1,
							x2, y2, z2,
							xtheta, ytheta, ztheta) {
	var p1 = [];
	var rot = matrixMul(matrixMul(rotX(xtheta),rotY(ytheta)),rotZ(ztheta));
	p1.push(matrixMul([[x1, y1, z1, 1]],rot));
	p1.push(matrixMul([[x1, y2, z2, 1]],rot));
	p1.push(matrixMul([[x2, y2, z2, 1]],rot));
	p1.push(matrixMul([[x2, y1, z1, 1]],rot));

	var p2 = [];
	for (var i=0; i<p1.length; i++) {
		p2.push([p1[i][0][0]/(PP*p1[i][0][2]+1), p1[i][0][1]/(PP*p1[i][0][2]+1)])
	}

	ctx.beginPath();
	ctx.moveTo((0.5+0.01*p2[0][0])*W, (0.5+0.01*p2[0][1])*H);
	for (var i=1; i<p2.length; i++) {
		ctx.lineTo((0.5+0.01*p2[i][0])*W, (0.5+0.01*p2[i][1])*H);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

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
	ctx.strokeStyle = GRAY;
	ctx.lineWidth = 4;
	plotRectPrism(-25, 0, -10,
		 25, 40, 0,
		 XT, YT, ZT);
}

//small box
var drawSmallBox = function() {
	ctx.strokeStyle = COLORS[ROW];
	ctx.lineWidth = 5;
	plotRectPrism(-25, BOXLEVEL, -10,
		 25, BOXLEVEL+10, 0,
		 XT, YT, ZT);
}

//tracks
var drawTracks = function() {
	ctx.strokeStyle = GRAY;
	ctx.fillStyle = "#111111";
	ctx.lineWidth = 3;
	plotRectFill(-20,BOXLEVEL+5,0,20,0,-1000,XT,YT,ZT);
    for (var i=-10; i<=10; i+=10) {
		plotLine(i,BOXLEVEL+5,0,i,0,-1000,XT,YT,ZT);
    }
    //plotLine(-20,BOXLEVEL+5,0,20,BOXLEVEL+5,0,XT,YT,ZT);
}

var drawNotes = function() {
	var note;
	for (var i=0; i<NOTES.length; i++) {
		note = NOTES[i];
	    ctx.strokeStyle = BORDERS[note.row];
	    ctx.fillStyle = COLORS[note.row];
	    ctx.lineWidth = 3;
	    var x = 10*note.col-15;
	    var z = note.z;
	    var y = BOXLEVEL+5+z*Math.atan((BOXLEVEL+5)/1000);

	    var t = pi/2.75;
	    var k = 3/4;
	    plotCircleFill(x, y, z, 5, XT, YT, ZT);
	    plotCircleFill(x, y-(5*sin(t)*k), z, 5*cos(t), XT, YT, ZT);

	    var rot = matrixMul(matrixMul(rotX(XT),rotY(YT)),rotZ(ZT));
	    var points = [];
	    //right arc
	   	for (var j=0; j<NOTE_CURVE_N; j++) {
			var dt = j*t/(NOTE_CURVE_N-1);
			var p = matrixMul([[x+5*cos(dt), y-(5*sin(dt)*k), z, 1]], rot);
			points.push([p[0][0]/(PP*p[0][2]+1), p[0][1]/(PP*p[0][2]+1)]);
	    }
	    ctx.beginPath();
	    ctx.moveTo((0.5+0.01*points[0][0])*W, (0.5+0.01*points[0][1])*H);
	    for (var j=1; j<points.length; j++) {
			ctx.lineTo((0.5+0.01*points[j][0])*W, (0.5+0.01*points[j][1])*H);
	    }
	    ctx.stroke();

	    //left arc
	    points = [];
	   	for (var j=0; j<NOTE_CURVE_N; j++) {
			var dt = j*t/(NOTE_CURVE_N-1);
			var p = matrixMul([[x-5*cos(dt), y-(5*sin(dt)*k), z, 1]], rot);
			console.log(p);
			points.push([p[0][0]/(PP*p[0][2]+1), p[0][1]/(PP*p[0][2]+1)]);
	    }
	    ctx.beginPath();
	    ctx.moveTo((0.5+0.01*points[0][0])*W, (0.5+0.01*points[0][1])*H);
	    for (var j=1; j<points.length; j++) {
			ctx.lineTo((0.5+0.01*points[j][0])*W, (0.5+0.01*points[j][1])*H);
	    }
	    ctx.stroke();
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
		var anim = setInterval(function() {
		    clearScreen();
		    BOXLEVEL += 10/ROW_SHIFT_N;
		    drawAll();
		    if (BOXLEVEL - ROW*10 > -0.0001) {
		    	BOXLEVEL = ROW*10;
		    	clearInterval(anim);
		    }
		},ROW_SHIFT_N/ROW_SHIFT_T);
    }
}

var rowUp = function() {
    if (ROW > 0) {
		ROW--; //needs to be INSTANT so people don't get screwed by animation	
		//todo later: rewrite with the fps of the whole program
		var STEPS = 10;
		var MS = 20;
		var anim = setInterval(function() {
		    clearScreen();
		    BOXLEVEL -= 10/ROW_SHIFT_N;
		    drawAll();
		    if (BOXLEVEL - ROW*10 < 0.0001) {
		    	BOXLEVEL = ROW*10;
		    	clearInterval(anim);
		    }
		},ROW_SHIFT_N/ROW_SHIFT_T);
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
		createNote(rand(),rand(),-1000);
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

//var n = "1,y,0:01|2,y,0:23|2,g,0:24|4,b,0:40"
//console.log(parseTrack(n));
//playTrack(parseTrack(n));
function rand() {
    return Math.floor(4*Math.random());
}

drawBigBox();
drawTracks();
drawSmallBox();
drawNotes();

var scroll = setInterval(function() {
    clearScreen();
    for (var i=0; i<NOTES.length; i++) {
    	NOTES[i].z+=3;
    }
    drawAll();
},2);

//plotCircleFill(5,5,0,5,XT,YT,ZT);


/*

for (var i=0; i>-1000; i-=100) {
	plotCircle(5,5,i,5,pi/-20,0,0);
}*/
