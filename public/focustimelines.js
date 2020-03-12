//This is where we handle both the focus timeline and the timeline marker that hits all the table svgs
var video = document.getElementById('ux-video');

var margin = { top: 10, right: 50, bottom: 10, left: 50 },
    width = video.width;
var height = 100 - margin.top - margin.bottom;
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
        if(focussvg.select('rect.selection').attr('width') > 0 | focussvg.select('rect.selection').attr('width') == null){rescaleTimelines();}
    })

//Leave space for cursor
brushg = focussvg.append('g').attr('class', 'context').attr('transform', 'translate(0,'+ hmargin + ')')

brushg.append('g')
.attr('class', 'x brush')
.call(brush)
.selectAll('rect');

function rescaleTimelines(){
    rescaleEmotions();
    rescaleActions();
    rescaleSpeechrate();
    rescalePitch();
}

function rescaleEmotions(){
    var emotions = d3.select("#emotionrects")
    var maxEnd = parseFloat(emotions.attr('maxEnd'))
    var fps = maxEnd/video.duration

    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    if(isNaN(selwid)){
        selwid = video.width;
        selX = 1;
    }

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

    if(isNaN(selwid)){
        selwid = video.width;
        selX = 1;
    }


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

function rescaleSpeechrate(){
    
    var line = d3.select("#speechratelinepath")
    var maxEnd = parseFloat(line.attr("maxEnd"));

    var data = JSON.parse(line.attr("origdata"));

    var fps = maxEnd/video.duration

    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    if(isNaN(selwid)){
        selwid = video.width;
        selX = 1;
    }


    var minTime = video.duration * selX/video.width
    var maxTime = video.duration * ( selX + selwid )/video.width  

    var widMult = video.width/selwid

    var newMinFrame = minTime * fps
    var newMaxFrame = maxTime * fps
    var filtdata = _.filter(data, function(o){return parseFloat(o.x) >= newMinFrame & parseFloat(o.x) <= newMaxFrame })
    line.datum(filtdata)

    var x = d3.scaleLinear()
        .domain([newMinFrame, newMaxFrame])
        .range([0, video.width]);

    var y = d3.scaleLinear()
        .domain([70, 200])
        .range([height, 0]);

    line.transition().duration(50).attr("d", function(d){    
        return(d3.line()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
        )(d)
    })

    /**
     * need to update our mouse activity
     * */
     // Create the circle that travels along the curve of chart
     var focus = d3.select('#speechratefocuscircle')
     // Create bg for the text that travels along the curve of chart
    var focusTextRect = d3.select('#speechratefocustextbg')
     // Create the text that travels along the curve of chart
     var focusText = d3.select('#speechratefocustext')
    
   d3.select("#speechratemouserect")
    .on('mousemove', mousemove)
    .on('click', mouseclick);
        
    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function (d) { return d.x; }).left;


    function mousemove() {
        // recover coordinate we need
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]
        var minutes = Math.floor((video.duration * selectedData.x/maxEnd)/60)
        var seconds = Math.round(60 * (((video.duration * selectedData.x/maxEnd)/60) - minutes))
        var secStr = seconds < 10 ? "0" + seconds.toString() : seconds.toString()
        focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y))
        focusTextRect
            .attr("x", x(selectedData.x) + 10)
            .attr("y", y(selectedData.y) - 15)
        focusText
        .html("Time:" + minutes.toString() + ":" + secStr + "  -  " + "Pitch:" + selectedData.y)
        .attr("x", x(selectedData.x) + 15)
            .attr("y", y(selectedData.y))
    }

    function mouseclick(){
        //get a new maxEnd--paths handle focus differently, so we need to do this.
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]

        video.currentTime = video.duration * selectedData.x/maxEnd

    }
}


function rescalePitch(){
    
    var line = d3.select("#pitchlinepath")
    var maxEnd = parseFloat(line.attr("maxEnd"));

    var data = JSON.parse(line.attr("origdata"));

    var fps = maxEnd/video.duration

    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    if(isNaN(selwid)){
        selwid = video.width;
        selX = 1;
    }

    var minTime = video.duration * selX/video.width
    var maxTime = video.duration * ( selX + selwid )/video.width  

    var widMult = video.width/selwid

    var newMinFrame = minTime * fps
    var newMaxFrame = maxTime * fps
    var filtdata = _.filter(data, function(o){return parseFloat(o.x) >= newMinFrame & parseFloat(o.x) <= newMaxFrame })
    line.datum(filtdata)

    var x = d3.scaleLinear()
        .domain([newMinFrame, newMaxFrame])
        .range([0, video.width]);


    var y = d3.scaleLinear()
        .domain([0, 200])
        .range([height, 0]);
        
    line.transition().duration(50).attr("d", function(d){    
        return(d3.line()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
        )(d)
    })

        /**
     * need to update our mouse activity
     * */
     // Create the circle that travels along the curve of chart
     var focus = d3.select('#pitchfocuscircle')
     // Create bg for the text that travels along the curve of chart
    var focusTextRect = d3.select('#pitchfocustextbg')
     // Create the text that travels along the curve of chart
     var focusText = d3.select('#pitchfocustext')
    
   d3.select("#pitchmouserect")
    .on('mousemove', mousemove)
    .on('click', mouseclick);
        
    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function (d) { return d.x; }).left;


    function mousemove() {
        // recover coordinate we need
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]
        var minutes = Math.floor((video.duration * selectedData.x/maxEnd)/60)
        var seconds = Math.round(60 * (((video.duration * selectedData.x/maxEnd)/60) - minutes))
        var secStr = seconds < 10 ? "0" + seconds.toString() : seconds.toString()
        focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y))
        focusTextRect
            .attr("x", x(selectedData.x) + 10)
            .attr("y", y(selectedData.y) - 15)
        focusText
        .html("Time:" + minutes.toString() + ":" + secStr + "  -  " + "Pitch:" + selectedData.y)
        .attr("x", x(selectedData.x) + 15)
            .attr("y", y(selectedData.y))
    }

    function mouseclick(){
        //get a new maxEnd--paths handle focus differently, so we need to do this.
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]

        video.currentTime = video.duration * selectedData.x/maxEnd

    }


}