/**
 * Add pan dragging to all timelines. 
 */
var video = document.getElementById('video_html5_api');
refreshuxSDimVars();

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
  d3.select(this).attr('isdragging', true);
  mouseStartX = 1*d3.event.x
  mouseStartExtMin = parseFloat(selRect.attr('x'))
  mouseStartExtMax = mouseStartExtMin + parseFloat(selRect.attr('width')) 
  
  interactiontracking(JSON.stringify(d3.event), this.parentNode.getAttribute("id"), this.parentNode.getAttribute("id"), 'drag start')
}

function panned() {
    var focusselectbox = focussvg.select('rect.selection');

    if(focusselectbox.attr('style') == ""){
      redrawBrush()  
      interactiontracking(JSON.stringify(d3.event), this.getAttribute("id"), this.getAttribute("id"), 'drag')
    }
}

function panended() {
  d3.select(this).attr('isdragging', false);
  interactiontracking(JSON.stringify(d3.event), this.getAttribute("id"), this.getAttribute("id"), 'drag end')
    //do something if needed, but I think we are good
}
