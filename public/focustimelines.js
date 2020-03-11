//This is where we handle both the focus timeline and the timeline marker that hits all the table svgs
var video = document.getElementById('ux-video');

var margin = { top: 10, right: 50, bottom: 10, left: 50 },
    width = video.width;
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
        if(focussvg.select('rect.selection').attr('width') > 0){rescaleTimelines();}
    });

//Leave space for cursor
brushg = focussvg.append('g').attr('class', 'context').attr('transform', 'translate(0,'+ hmargin + ')')

brushg.append('g')
.attr('class', 'x brush')
.call(brush)
.selectAll('rect');

function rescaleTimelines(){
    rescaleEmotions();
    rescaleActions();
}

function rescaleEmotions(){
    var emotions = d3.select("#emotionrects")
    var maxEnd = parseFloat(emotions.attr('maxEnd'))
    var fps = maxEnd/video.duration

    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    var minTime = video.duration * selX/video.width
    var maxTime = video.duration * ( selX + selwid )/video.width  

    var widMult = video.width/selwid

    var newMinFrame = minTime * fps
    var newMaxFrame = maxTime * fps

    var x = d3.scaleLinear()
    .domain([newMinFrame, newMaxFrame])
    .range([0, video.width]);

    function rectWidth(lowerVal, upperVal){
        gap = upperVal-lowerVal;
        rangeMult = widMult * (video.width/maxEnd)
        return (gap * rangeMult)
    }

    emotions.selectAll('.emotionrect')
    .transition().duration(50)
    .attr('width', function(d){
        return(rectWidth(d.start, d.end))
    })
    .attr('x', function(d){
        return(x(d.start))
    })

}


function rescaleActions(){
    var actions = d3.select("#action1rects")
    var maxEnd = parseFloat(actions.attr('maxEnd'))
    var fps = maxEnd/video.duration

    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    var minTime = video.duration * selX/video.width
    var maxTime = video.duration * ( selX + selwid )/video.width  

    var widMult = video.width/selwid

    var newMinFrame = minTime * fps
    var newMaxFrame = maxTime * fps

    var x = d3.scaleLinear()
    .domain([newMinFrame, newMaxFrame])
    .range([0, video.width]);

    function rectWidth(lowerVal, upperVal){
        gap = upperVal-lowerVal;
        rangeMult = widMult * (video.width/maxEnd)
        return (gap * rangeMult)
    }

    actions.selectAll('.action1rect')
    .transition().duration(50)
    .attr('width', function(d){
        return(rectWidth(d.start, d.end))
    })
    .attr('x', function(d){
        return(x(d.start))
    })

}