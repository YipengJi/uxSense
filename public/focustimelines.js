//This is where we handle both the focus timeline and the timeline marker that hits all the table svgs
var video = document.getElementById('ux-video');
var width = video.width;
var focusHeight = 10;
var hmargin = 10;
//Todo: add some margins for animation

var focussvg = d3.select('#premierefocus').append('svg')
    .attr('id', 'focussvg')
    .attr('width', width)
    .attr('height',focusHeight + hmargin)
    .append('g')
    //.attr('transform', 'translate(0,' + hmargin + ')');

var bgslide = focussvg.append('rect')
.attr('id', 'focusrectback')
.attr('fill', "lightgrey")
.attr('width', width)
.attr('height', focusHeight)
.attr('y', hmargin)

var xScaleTop = d3.scaleTime().range([0, width]);
var xScaleBottom = d3.scaleTime().range([0, width]);
var xAxisTop = d3.axisBottom(xScaleTop);

var brush = d3.brushX()
    .extent([[0, 0], [width, focusHeight]])
    .on("brush end", function () {
        var s = d3.event.selection || xScaleBottom.range();
        xScaleTop.domain(s.map(xScaleBottom.invert, xScaleBottom));
        d3.selectAll('.x.axis').call(xAxisTop);
        video.currentTime = video.duration * (focussvg.select('rect.selection').attr('x') / width)
        //focus.select(".line").attr("d", lineTop);
    });

//Leave space for cursor
brushg = focussvg.append('g').attr('class', 'context').attr('transform', 'translate(0,'+ hmargin + ')')

brushg.append('g')
.attr('class', 'x brush')
.call(brush)
.selectAll('rect');

