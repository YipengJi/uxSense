document.addEventListener("DOMContentLoaded", function (event) {
    var video = document.getElementById('ux-video');

    var margin = { top: 10, right: 0, bottom: 30, left: 0 },
        // width = 460 - margin.left - margin.right,
        // height = 400 - margin.top - margin.bottom;
        width = video.width,
        height = 100 - margin.top - margin.bottom;
    

    var brush = d3.brushY()    
    .extent([[0, 0], [15, height]])
    .on("brush end", function () {
        var s = d3.event.selection || xScaleBottom.range();
        xScaleTop.domain(s.map(xScaleBottom.invert, xScaleBottom));
        d3.selectAll('.x.axis').call(xAxisTop);
        video.currentTime = video.duration * (focussvg.select('rect.selection').attr('x') / width)
        //focus.select(".line").attr("d", lineTop);
        if(focussvg.select('rect.selection').attr('width') > 0 | focussvg.select('rect.selection').attr('width') == null){rescaleTimelines();}
    })
 
        

    var speechslider = d3.select("#speech-rate").select('svg')
    .append('g')
    .attr('id', 'speechrate-filt-slider')

    speechbrushg = speechslider.append('g').attr('class', 'context')//.attr('transform', 'translate(0,0)')

    speechbrushg.append('rect')
    .attr('height', height)
    .attr('width', 15)
    .attr('fill', '#862d86')
    .attr('class', 'y brush')
    .call(brush)
    .selectAll('rect');


    var pitchslider = d3.select("#pitch").select('svg')
    .append('g')
    .attr('id', 'speechrate-filt-slider')

    pitchbrushg = pitchslider.append('g').attr('class', 'context')//.attr('transform', 'translate(0,0)')

    pitchbrushg.append('rect')
    .attr('height', height)
    .attr('width', 15)
    .attr('fill', '#862d86')
    .attr('class', 'y brush')
    .call(brush)
    .selectAll('rect');
});