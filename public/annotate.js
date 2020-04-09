function addAnnotation(){
    var annotation = document.getElementById('annotation-text');
    //send annotation to server
    $.ajax({ 
        url: '/annotate'
        , type: 'POST'
        , cache: false
        , data: { annotation: annotation.value, timestamp:document.getElementById("video_html5_api").currentTime, posttime:(new Date().getTime())}
        , callback: function(response){
            console.log(response)
        } 
        , success: function(data){
            document.getElementById("annotation-text").value = null
            //annotationTabPop();
            d3.json('userAnnotations/data.json', function(rawdata){
                var tdata = _.sortBy(rawdata, [function(o) { return parseFloat(o.timestamp); }])
                var tbody = d3.select('#annotation-table')
                .select('tbody')
                .data(tdata)
        
                tbody.selectAll('.annotrow').remove();
                
                tdata.forEach(function(d){
                    var row = tbody.append('tr').datum(d).attr('class', 'annotrow')
                
                    var timeNum = parseFloat(d.timestamp)
            
                    var minute = Math.floor(timeNum/60)
                    var second = Math.round(timeNum - 60*minute)
                    var minstr = minute < 10 ? "0" + minute.toString() : minute.toString();
                    var secstr = second < 10 ? "0" + second.toString() : second.toString();
        
                    var timestr = minstr + ":" + secstr
            
                    row.append('td')
                    .attr('style', 'width:20%')
                    .text(timestr)
            
                    row.append('td')
                    .attr('style', 'width:80%')
                    .text(d.annotation)        
            
                })  
            })          
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}


function addPointAnnotation(timelineID){
    var annotation = document.getElementById('annotation-text');

    interactiontracking(annotation.value, timelineID, 'annotate-submit', 'click', [{annotationtype: "point"}])


    //send annotation to server
    $.ajax({ 
        url: '/annotate'
        , type: 'POST'
        , cache: false
        , data: { annotation: annotation.value, timestamp:document.getElementById("video_html5_api").currentTime, posttime:(new Date().getTime()), timeline:timelineID, annotationtype:"point"}
        , callback: function(response){
            console.log(response)
        } 
        , success: function(data){
            document.getElementById("annotation-text").value = null
            d3.select('#AnnotationTooltip').style('display', 'none')
            //annotationTabPop();
            d3.json('userAnnotations/data.json', function(rawdata){
                var tdata = _.sortBy(rawdata, [function(o) { return parseFloat(o.timestamp); }])
                var tbody = d3.select('#annotation-table')
                .select('tbody')
                .data(tdata)
        
                tbody.selectAll('.annotrow').remove();
                
                tdata.forEach(function(d){
                    var row = tbody.append('tr').datum(d).attr('class', 'annotrow')
                
                    var timeNum = parseFloat(d.timestamp)
            
                    var minute = Math.floor(timeNum/60)
                    var second = Math.round(timeNum - 60*minute)
                    var minstr = minute < 10 ? "0" + minute.toString() : minute.toString();
                    var secstr = second < 10 ? "0" + second.toString() : second.toString();
        
                    var timestr = minstr + ":" + secstr
            
                    row.append('td')
                    .attr('style', 'width:20%')
                    .text(timestr)
            
                    row.append('td')
                    .attr('style', 'width:80%')
                    .text(d.annotation)        
            
                })  
            })          
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}

function addIntervalAnnotation(timelineID){
    var annotation = document.getElementById('annotation-text');

    interactiontracking(annotation.value, timelineID, 'annotate-submit', 'click', [{annotationtype: "interval"}])

    //send annotation to server
    $.ajax({ 
        url: '/annotate'
        , type: 'POST'
        , cache: false
        , data: { annotation: annotation.value, timestamp:document.getElementById("video_html5_api").currentTime, posttime:(new Date().getTime()), timeline:timelineID, annotationtype:"interval"}
        , callback: function(response){
            console.log(response)
        } 
        , success: function(data){
            document.getElementById("annotation-text").value = null
            d3.select('#AnnotationTooltip').style('display', 'none')
            //annotationTabPop();
            d3.json('userAnnotations/data.json', function(rawdata){
                var tdata = _.sortBy(rawdata, [function(o) { return parseFloat(o.timestamp); }])
                var tbody = d3.select('#annotation-table')
                .select('tbody')
                .data(tdata)
        
                tbody.selectAll('.annotrow').remove();
                
                tdata.forEach(function(d){
                    var row = tbody.append('tr').datum(d).attr('class', 'annotrow')
                
                    var timeNum = parseFloat(d.timestamp)
            
                    var minute = Math.floor(timeNum/60)
                    var second = Math.round(timeNum - 60*minute)
                    var minstr = minute < 10 ? "0" + minute.toString() : minute.toString();
                    var secstr = second < 10 ? "0" + second.toString() : second.toString();
        
                    var timestr = minstr + ":" + secstr
            
                    row.append('td')
                    .attr('style', 'width:20%')
                    .text(timestr)
            
                    row.append('td')
                    .attr('style', 'width:80%')
                    .text(d.annotation)        
            
                })  
            })          
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}

