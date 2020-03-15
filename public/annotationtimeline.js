var emotChunkWid = 240;
var video = document.getElementById("ux-video");

// set the dimensions and margins of the graph
var margin = { top: 10, right: 50, bottom: 10, left: 50 },
    width = 1200,
    height = 100 - margin.top - margin.bottom;

var crectheight = 5

// we want to aggregate our count to some level of timespan for plotting, and then we want the user to be able to drill down into it
var annosvg = d3.select("#AnnotationTimeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json('userAnnotations/data.json', function(data){
    console.log(data)

    var mainanno = annosvg.append('rect')
    .attr('fill', '#ffa31a')
    .attr('width', width)
    .attr('height', crectheight)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('y', (height - crectheight)/2)

    

})