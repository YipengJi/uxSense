    
function vidstatelog(){
    $.ajax({ 
        url: '/statelog',
        type: 'POST',
        cache: false, 
        data: {
            vidtime:document.getElementById('video_html5_api').currentTime, 
            vidname:uxSenseVideoPath, 
            timestamp:(new Date().getTime())
        }, 
        success: function(){
            //alert('Success!')
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })    
    setTimeout("vidstatelog()", 5000)
}


vidstatelog();