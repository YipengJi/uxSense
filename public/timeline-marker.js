/**
 * I should really start commenting my code better. Create timeline "cursor" (current time indicator)--should be draggable
 */
var video = document.getElementById('video_html5_api');
var height = 100;
var margin = { top: 0, right: 50, bottom: 0, left: 50 }

//windowsize fix
width = window.innerWidth - (margin.left + margin.right)



// set the dimensions and margins of the graph
var margin = { top: 10, right: 50, bottom: 30, left: 50 }

var focussvg = d3.select('#focussvg').select('g')
var markersize = 100;

var symbolGenerator = d3.symbol()
  .type(d3.symbolTriangle)
  .size(markersize);

var pathData = symbolGenerator();

//create draggable marker
focussvg.append('path')
  .attr('d', pathData)
  .attr('id', 'markertriangle')
  .attr('transform', 'rotate(180)')
  .attr('style', 'fill:red; pointer-events:all;')
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

function dragstarted() {
  d3.select(this).raise().classed("active", true);
}

function dragged() {
  video.currentTime = video.duration * d3.event.x/width
  d3.select(this)
  .attr('transform', 'rotate(180) translate('+(-d3.event.x)+',0)')
}

function dragended() {
  video.currentTime = video.duration * d3.event.x/width
  d3.select(this).classed("active", false);
}

function moveMarker() {
  var minTime = 0;
  var maxTime = video.duration;
  var focusselectbox = focussvg.select('rect.selection');
  
  if(focusselectbox.attr('style') == ""){
    minTime = video.duration * focusselectbox.attr('x')/width
    maxTime = video.duration * (parseFloat(focusselectbox.attr('x')) + parseFloat(focusselectbox.attr('width')))/width  
  } 

  var cursorlineX = width * (video.currentTime - minTime)/(maxTime-minTime)

  try{
    //try to remove marker g.rects for all timelines
    d3.selectAll('.timeline-marker').remove();
  }catch(err){
    console.log(err)
  }

  var markerX = width * (video.currentTime/video.duration)

  //add marker g.rects for all timelines
  d3.select('.timelines-box').selectAll('svg')
  .append('g')
  .attr('class', 'timeline-marker')
  .attr('transform', 'translate('+margin.left+','+margin.top+')')
  .append('rect')
  .attr('fill', 'red')
  .attr('width', '2')
  .attr('height', height)
  .attr('x', cursorlineX)

  var marker = d3.select("#markertriangle");

  if(marker.attr('class') == 'active'){
    setTimeout("moveMarker()", 50)
  } else {
    marker.transition().duration(50).attr('transform', 'rotate(180) translate('+(-markerX)+',0)')
    .on("end",function(){moveMarker()})
  }
}

moveMarker();