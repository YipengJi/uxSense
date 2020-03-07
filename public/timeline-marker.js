/**
 * I should really start commenting my code better. Create timeline "cursor" (current time indicator)--should be draggable
 */
var video = document.getElementById('ux-video');
//var width = video.width;
var height = 100;

// set the dimensions and margins of the graph
var margin = { top: 10, right: 0, bottom: 30, left: 0 }

var minTime = 0;
var maxTime = video.duration;

var focussvg = d3.select('#focussvg').select('g')
var markersize = 100;

var symbolGenerator = d3.symbol()
  .type(d3.symbolTriangle)
  .size(markersize);

var pathData = symbolGenerator();

focussvg.append('path')
  .attr('d', pathData)
  .attr('id', 'markertriangle')
  //.attr('transform', 'rotate(180) translate(-5,0)')
  .attr('transform', 'rotate(180)')
  .style('fill', 'red')
//  .attr('transform', 'rotate(180) translate(-5,-'+ hmargin + ')')


function moveMarker() {
  var focusselectbox = focussvg.select('rect.selection');
  if(focusselectbox.style == ""){
    minTime = video.duration * focusselectbox.attr('x')/video.width
    maxTime = video.duration * (focusselectbox.attr('x') + focusselectbox.attr('width'))/video.width  
  } else {
    maxTime = video.duration;
    minTime = 0;
  }
  var cursorlineX = video.width * ((((maxTime-minTime)/video.duration)*video.currentTime)/maxTime)

  try{
    //try to remove marker g.rects for all timelines
    d3.selectAll('.timeline-marker').remove();
  }catch(err){
    console.log(err)
  }
  
  var markerX = video.width * (video.currentTime/video.duration)
  console.log(markerX)

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

  d3.select("#markertriangle").transition().duration(500).attr('transform', 'rotate(180) translate('+(-markerX)+',0)')
    .on("end",function(){moveMarker()})
}

moveMarker()