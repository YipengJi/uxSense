/**
 * Add pan dragging to all timelines. 
 */
var video = document.getElementById('video_html5_api');
var height = 100;
var width = 1200;
var focusHeight = 10;
var hmargin = 10;


//windowsize fix
width = width * 1.25/window.devicePixelRatio


// set the dimensions and margins of the graph
var margin = { top: 10, right: 50, bottom: 30, left: 50 }

var focussvg = d3.select('#focussvg').select('g')
var focusBrush = focussvg.select('g.x.brush')
var selRect = focusBrush.select('rect.selection')

var mouseStartX;
var mouseStartExtMin;
var mouseStartExtMax;

//Add panning dragging to all nodes
d3.select('.timelines-box').selectAll('svg')
  .call(d3.drag()
    .on("start", panstarted)
    .on("drag", panned)
    .on("end", panended));

function redrawBrush() {
    // redefine our brush extent; we subtract event from start bc we want to drag the same dir as mouse moves
    var moveDistance = (mouseStartX - d3.event.x) * (parseFloat(selRect.attr('width'))/width);

    var newextmin = mouseStartExtMin + moveDistance
    var newextmax = mouseStartExtMax + moveDistance

    var newext = [newextmin, newextmax]

    if(newextmin < 0){
        newext = [0, parseFloat(selRect.attr('width'))];
    }

    if(newextmax > width){
        newext = [width - parseFloat(selRect.attr('width')), width];
    }

    //we are kind of depending on the brush var from our focustimelines.js script to not be redefined elsewhere; not a great practice, but time limits!
    brush.move(focusBrush, newext)

}

    
function panstarted() {
  mouseStartX = 1*d3.event.x
  mouseStartExtMin = parseFloat(selRect.attr('x'))
  mouseStartExtMax = mouseStartExtMin + parseFloat(selRect.attr('width')) 
}

function panned() {
    var focusselectbox = focussvg.select('rect.selection');

    if(focusselectbox.attr('style') == ""){
      redrawBrush()  
    }
}

function panended() {
    //do something if needed, but I think we are good
}
