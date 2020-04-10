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
            annotationQueryRefresh();
            d3.select('#AnnotationTooltip').style('display', 'none')
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
            annotationQueryRefresh();
            d3.select('#AnnotationTooltip').style('display', 'none')
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
            annotationQueryRefresh();
            d3.select('#AnnotationTooltip').style('display', 'none')
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}

