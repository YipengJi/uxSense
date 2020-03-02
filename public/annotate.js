function addAnnotation(){
    var annotation = document.getElementById('annotation-text');
    //send annotation to server
    $.ajax({ 
        url: '/annotate',
        type: 'POST',
        cache: false, 
        data: { annotation: annotation.value}, 
        success: function(){
        //alert('Success!')
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}
