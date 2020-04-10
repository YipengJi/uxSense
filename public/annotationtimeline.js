var emotChunkWid = 240;
var uxvideo = document.getElementById("video_html5_api");




var crectheight = 5

// we want to aggregate our count to some level of timespan for plotting, and then we want the user to be able to drill down into it
var annosvg = d3.select("#AnnotationTimeline")
    .append("svg")
    .attr("width", "100%")
    .attr("height", (height + margin.top + margin.bottom))
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "none")
    .style('display', 'inline-block')
    .style('position', 'relative')

//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
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