var video = document.getElementById('ux-video');

var margin = { top: 0, right: 50, bottom: 0, left: 50 },
    // width = 460 - margin.left - margin.right,
    // height = 400 - margin.top - margin.bottom;
    width = video.width,
    height = 100;

    var sliderwidth = 5;


document.addEventListener("DOMContentLoaded", function (event) {
    
    drawPathSlider('speech-rate', 'speechratelinepath');
    drawPathSlider('pitch', 'pitchlinepath');
    drawBarSlider('Action1');
    drawBarSlider('Emotion');

});


function drawPathSlider(containerID, pathID){

    var svg = d3.select("#" + containerID).select('svg')

    var path = svg.select("#" + pathID)

    try{
        var data = JSON.parse(path.attr('origdata'));
    } catch{
        setTimeout('drawPathSlider("' + containerID + '","' + pathID + '")', 100);
        return 'Done';
    }
    var yScaleBottom = d3.scaleLinear().range([0, height]);
    yScaleBottom.domain(d3.extent(data, function (d) { return d.close; }));

    var filterbrush = d3.brushY()    
    .extent([[0, 0], [15, height]])
    .on("brush end", function () {
        var s = d3.event.selection || ScaleBottom.range();
        console.log(s)
        //xScaleTop.domain(s.map(xScaleBottom.invert, xScaleBottom));
        //d3.selectAll('.x.axis').call(xAxisTop);
        //video.currentTime = video.duration * (focussvg.select('rect.selection').attr('x') / width)
        //focus.select(".line").attr("d", lineTop);
        //if(focussvg.select('rect.selection').attr('width') > 0 | focussvg.select('rect.selection').attr('width') == null){rescaleTimelines();}
    })
         
    var slider = svg
    .append('g')
    .attr('height', height)
    .attr('width', 3*sliderwidth)
    .attr('id', containerID + '-filt-slider')
    .attr('class', 'filter-slider')

    var brushr = slider.append('rect')
    .attr('height', height)
    .attr('x', sliderwidth)
    .attr('width', sliderwidth)
    .attr('fill', '#862d86')

    var brushg = slider.append('g')
    .attr('height', height)
    .attr('width', 3*sliderwidth)
    .attr("class", "y brush")
    .call(d3.brushY().extent([[0, 0], [15, height]]).on("brush", filterbrush));


}


function drawBarSlider(containerID){

    var svg = d3.select("#" + containerID).select('svg')

    var g = svg.select("g")

    try{
        var data = g.enter().data();
    } catch{
        setTimeout('drawBarSlider("' + containerID + '")', 300);
        return 'Done';
    }
    var yScaleBottom = d3.scaleLinear().range([0, height]);
    yScaleBottom.domain(d3.extent(data, function (d) { return d.close; }));

    var filterbrush = d3.brushY()    
    .extent([[0, 0], [15, height]])
    .on("brush end", function () {
        var s = d3.event.selection || ScaleBottom.range();
        console.log(s)
        //xScaleTop.domain(s.map(xScaleBottom.invert, xScaleBottom));
        //d3.selectAll('.x.axis').call(xAxisTop);
        //video.currentTime = video.duration * (focussvg.select('rect.selection').attr('x') / width)
        //focus.select(".line").attr("d", lineTop);
        //if(focussvg.select('rect.selection').attr('width') > 0 | focussvg.select('rect.selection').attr('width') == null){rescaleTimelines();}
    })
         
    var slider = svg
    .append('g')
    .attr('height', height)
    .attr('width', 3*sliderwidth)
    .attr('id', containerID + '-filt-slider')
    .attr('class', 'filter-slider')

    var brushr = slider.append('rect')
    .attr('height', height)
    .attr('x', sliderwidth)
    .attr('width', sliderwidth)
    .attr('fill', '#862d86')

    var brushg = slider.append('g')
    .attr('height', height)
    .attr('width', 3*sliderwidth)
    .attr("class", "y brush")
    .call(d3.brushY().extent([[0, 0], [15, height]]).on("brush", filterbrush));


}

