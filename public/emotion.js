var emotChunkWid = 240;

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// append the svg object to the body of the page
var emosvg = d3.select("#Emotion")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json('modeloutput/face_all_emotions_poses_gender.json', function(rawdata){
    var detaildata = [];
    var data = [];
    var framecnt = 0;

    for(i = 0; i < rawdata.length; i++){
        var d = rawdata[i];
        d.forEach(function(df){
            detaildata.push({"frame": framecnt, "emotion": df[2]})
            if(typeof detaildata[framecnt].emotion == "undefined"){
                detaildata[framecnt].emotion = "N/A"
            }
            framecnt++;
        })
    }
 
    for(i = emotChunkWid; (i+emotChunkWid-1) < detaildata.length; i+=emotChunkWid){
        var thisChunk = _.filter(detaildata, function(d){return ((d.frame < i) & (d.frame >= i-emotChunkWid))})
        
        var groupCnt = _.countBy(thisChunk, function(d){return(d.emotion)})
        var groupCntNoNA = _.omit(groupCnt, 'N/A');
        
        var winner = 'N/A';

        if(groupCnt.length == 1){
            winner = Object.keys(groupCnt)[0];
            try{
            } catch(err){
                    console.log(err)
                }
        } else {
            if(Object.keys(groupCnt)[0].length > 0){
                winner = _.reduce(groupCntNoNA, function(max, current, key) {
                    return max && max.value > current ? max : {
                        value: current,
                        key: key
                    };
                }).key    
            }
        }

        var obs = {'start':(i-emotChunkWid),'end':i, 'emotion':winner, 'prob':groupCnt[winner]/emotChunkWid}
        if(typeof obs.emotion == 'undefined'){
            obs = {'start':(i-emotChunkWid),'end':i, 'emotion':'N/A', 'prob':0}
        }

        data.push(obs) 
    }

    //var unqemot = _.uniq(_.map(detaildata, function(d){return(d.emotion)}))
    
    var colorScale = d3.scaleOrdinal(['#ececec', '#ff0101', '#68c500', '#e33af4', '#e3f43a', '#3a86f4', '#ffc900', '#b2b2b2'])
    .domain(['N/A', 'angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']);

    var maxEnd = _.max(_.map(data, function(dp){return(1*dp['end'])}));
    var x = d3.scaleLinear()
        .domain([1, maxEnd])
        .range([0, width]);

    var maxProb = _.max(_.map(data, function(dp){return(1*dp['prob'])}));
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

    var emog = emosvg.append('g')
        .data(data)

    d3.select('body').append('div')
    .attr('id', 'emotooltip')
    .style('opacity', 0)


    var allStarts = _.map(data, 'start')
    var startFrames = _.uniq(allStarts)

    startFrames.forEach(function(startframe){
        var thisData = _.filter(data, {'start':startframe})
        var bestprob = _.max(_.map(thisData,  function(dp){return(1*dp['prob'])}));

        var d = _.filter(thisData, function(dp){return(1*dp['prob']==bestprob)})[0]

        emog.append('rect')
        .attr('width', rectWidth(parseFloat(d.start), parseFloat(d.end)))
        .attr('id', 'rect_emotion_'+d.start)
        .attr('x', x(d.start))
        .attr('height', rectHeight(1*d.prob))
        .attr('y', y(parseFloat(d.prob)))
        .attr('fill', colorScale(d.emotion))
        .on('mouseover', function(){
            d3.select('#emotooltip')
            .transition().duration(100)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")   
            .style('opacity', 1)

            d3.select('#emotooltip')
            .html("emotion: " + d.emotion + "<br/>rel. likelihood: " + (Math.round(10000*(d.prob))/100) + "%")

            //TODO: MODULARIZE OUR TRACKING so that we don' thave to add a full $.ajax call spec for each event 
            //Track event
            $.ajax({ 
                url: '/log',
                type: 'POST',
                cache: false, 
                data: { data: d, event: {object: 'rect_emotion_'+d.start, trigger: 'mouseover', timestamp:(new Date().getTime())}}, 
                success: function(){
                   //alert('Success!')
                }
                , error: function(jqXHR, textStatus, err){
                    console.log('text status '+textStatus+', err '+err)
                }
            })
     
        })
        .on('mouseout', function(){
            d3.select('#emotooltip')
            .transition().duration(100)
            .style('opacity', 0)

            //Track event
            $.ajax({ 
                url: '/log',
                type: 'POST',
                cache: false, 
                data: { data: d, event: {object: 'rect_emotion_'+d.start, trigger: 'mouseout', timestamp:(new Date().getTime())}}, 
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