MINX = -5;
MAXX = 5;
MINY = -3;
MAXY = 3;

DX = 10;
DY = 10;

var genHeat = function(f) {
  //generate points for heatmap of f(x,y)
  var points = [];
  var max = -1*Infinity;
  var min = Infinity;
  var val, x, y;
  for (var px=0; px<window.innerWidth; px+=DX) {
    for (var py=0; py<window.innerHeight; py+=DY) {
      pyInv = window.innerHeight - py;
      x = (px/window.innerWidth)*MAXX + (1-(px/window.innerWidth))*MINX;
      y = (pyInv/window.innerHeight)*MAXY + (1-(pyInv/window.innerHeight))*MINY;
      val = math.re(f.evaluate( {x:x, y:y} ));
      if (val > max) { max = val; }
      if (val < min) { min = val; }
      points.push({
        x: px,
        y: py,
        value: val
      });
    }
  }
  return {max: max, min: min, data: points};
}

var plotFunction = function() {
  var equation = math.simplify(document.querySelector('#funcBox').value);
  heatmap.setData(genHeat(equation));
}

var updateCoordBox = function(event) {
  var coordBox = document.querySelector('#coordBox');
  //get mouse coords
  var mx = event.clientX;
  var my = event.clientY;
  //round to the nearest computed point and find value
  var px = DX*Math.round(mx/DX);
  var py = DY*Math.round(my/DY);
  var pyInv = window.innerHeight - py;
  var val = Math.round(1000*heatmap.getValueAt({ x:px, y:py }))/1000; //theyre int only :(
  //change coordBox text and position
  x = Math.round(1000*((px/window.innerWidth)*MAXX + (1-(px/window.innerWidth))*MINX))/1000;
  y = Math.round(1000*((pyInv/window.innerHeight)*MAXY + (1-(pyInv/window.innerHeight))*MINY))/1000;
  coordBox.innerHTML = "f("+x+", "+y+") = "+val;
}

var clearCoordBox = function(event) {
  coordBox.innerHTML = "";
}

//callbacks
document.querySelector('#funcButton').onclick = plotFunction;
document.querySelector('#mouse-div').onmousemove = updateCoordBox;
document.querySelector('#mouse-div').onmouseout = clearCoordBox;

//init
var heatmap = h337.create({
  container: document.querySelector('#heatmap-div'),
  backgroundColor: "black",
  radius: 12
});

document.querySelector('#funcBox').value = "x+500*cos(y)";
plotFunction();