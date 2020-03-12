var video = document.getElementById('ux-video');

var margin = { top: 0, right: 50, bottom: 0, left: 50 },
    // width = 460 - margin.left - margin.right,
    // height = 400 - margin.top - margin.bottom;
    width = video.width,
    height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#speech-rate")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv('modeloutput/TableauUser_Pitch_x100.csv', function (data) {

    var maxEnd = _.max(_.map(data, function(dp){return(1*dp['x'])}));
    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain([0, maxEnd])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")");
    // .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([70, 200])
        .range([height, 0]);
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function (d) { return d.x; }).left;

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
        .on('click', mouseclick);

    // Add the line
    svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
        )

    //do these after creating the chart path.

    // Create the circle that travels along the curve of chart
    var focus = svg
        .append('g')
        .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)

    // Create bg for the text that travels along the curve of chart
    var focusTextRect = svg
        .append('g')
        .append('rect')
        .style("opacity", 0)
        .attr("width", "110px")
        .attr("height", "25px")
        .attr("fill", "lightgrey")

    // Create the text that travels along the curve of chart
    var focusText = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .style('text-shadow', '1px 1px 5px white') 
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
        focus.style("opacity", 1)
        focusTextRect.style("opacity", 0.75)
        focusText.style("opacity", 1)
    }

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
            .html("Time:" + minutes.toString() + ":" + secStr + "  -  " + "Rate:" + selectedData.y)
            .attr("x", x(selectedData.x) + 15)
            .attr("y", y(selectedData.y))
    }
    function mouseout() {
        focus.style("opacity", 0)
        focusTextRect.style("opacity", 0)
        focusText.style("opacity", 0)
    }

    function mouseclick(){
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisect(data, x0, 1);
        selectedData = data[i]

        video.currentTime = video.duration * selectedData.x/maxEnd

    }

})