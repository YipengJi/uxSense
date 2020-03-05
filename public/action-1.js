
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
var actsvg = d3.select("#Action1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv('modeloutput/actions_all.csv', function(data){

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20c)
    .domain(_.uniq(_.map(data, 'action')));

    var maxEnd = _.max(_.map(_.map(data, 'end'), parseFloat))
    var x = d3.scaleLinear()
        .domain([1, maxEnd])
        .range([0, width]);

    var maxProb = _.max(_.map(_.map(data, function(dp){return 1*dp['prob']})), parseFloat)
    var y = d3.scaleLinear()
        .domain([0, maxProb])
        .range([height, 0]);

    function rectWidth(lowerVal, upperVal){
        gap = upperVal-lowerVal;
        rangeMult = (width/maxEnd)
        return (gap * rangeMult)
    }

    function rectHeight(prob){
        rangeMult = (height/maxProb)
        return (prob * rangeMult)
    }

    var actg = actsvg.append('g')
        .data(data)

    d3.select('body').append('div')
    .attr('id', 'acttooltip')
    .style('opacity', 0)


    var allStarts = _.map(data, 'start')
    var startFrames = _.uniq(allStarts)

    startFrames.forEach(function(startframe){
        var thisData = _.filter(data, {'start':startframe})
        var bestprob = _.max(_.map(thisData,  function(dp){return(1*dp['prob'])}));

        var d = _.filter(thisData, function(dp){return(1*dp['prob']==bestprob)})[0]

        actg.append('rect')
        .attr('width', rectWidth(parseFloat(d.start), parseFloat(d.end)))
        .attr('id', 'rect_action1_'+d.start)
        .attr('x', x(d.start))
        .attr('height', rectHeight(1*d.prob))
        .attr('y', y(parseFloat(d.prob)))
        .attr('fill', colorScale(d.action))
        .on('mouseover', function(){
            d3.select('#acttooltip')
            .transition().duration(100)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")   
            .style('opacity', 1)

            d3.select('#acttooltip')
            .html("action: " + d.action + "<br/>probability: " + (Math.round(10000*(d.prob))/100) + "%")

            //TODO: MODULARIZE OUR TRACKING so that we don' thave to add a full $.ajax call spec for each event 
            //Track event
            $.ajax({ 
                url: '/log',
                type: 'POST',
                cache: false, 
                data: { data: d, event: {object: 'rect_action1_'+d.start, trigger: 'mouseover', timestamp:(new Date().getTime())}}, 
                success: function(){
                   //alert('Success!')
                }
                , error: function(jqXHR, textStatus, err){
                    console.log('text status '+textStatus+', err '+err)
                }
            })
     
        })
        .on('mouseout', function(){
            d3.select('#acttooltip')
            .transition().duration(100)
            .style('opacity', 0)

            //Track event
            $.ajax({ 
                url: '/log',
                type: 'POST',
                cache: false, 
                data: { data: d, event: {object: 'rect_action1_'+d.start, trigger: 'mouseout', timestamp:(new Date().getTime())}}, 
                success: function(){
                   //alert('Success!')
                }
                , error: function(jqXHR, textStatus, err){
                    console.log('text status '+textStatus+', err '+err)
                }
            })

        })
        .on('click', function(){
            var video = document.getElementById("ux-video");
            var fps = maxEnd/video.duration;
            video.currentTime = d.start/fps;

        })

    })

})