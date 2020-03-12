function addIntervalAnnotation(){
    var annotation = document.getElementById('annotation-text');
    var video = document.getElementById("ux-video");
    var selrect = d3.select('#focussvg').select('rect.selection');

    var selwid = parseFloat(selrect.attr('width'))
    var selX = parseFloat(selrect.attr('x'))

    if(isNaN(selwid)){
        selwid = video.width;
        selX = video.width * video.currentTime / video.duration;
    }

    var minTime = video.duration * selX/video.width
    var maxTime = video.duration * ( selX + selwid )/video.width  


    //send annotation to server
    $.ajax({ 
        url: '/annotate'
        , type: 'POST'
        , cache: false
        , data: { annotation: annotation.value, timestamp:minTime, endtimestamp:maxTime, posttime:(new Date().getTime())}
        , callback: function(response){
            console.log(response)
        } 
        , success: function(data){
            document.getElementById("annotation-text").value = null
            annotationTabPop();
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}

