function addAnnotation(){
    var annotation = document.getElementById('annotation-text');
    //send annotation to server
    $.ajax({ 
        url: '/annotate'
        , type: 'POST'
        , cache: false
        , data: { annotation: annotation.value, timestamp:document.getElementById("ux-video").currentTime, posttime:(new Date().getTime())}
        , callback: function(response){
            console.log(response)
        } 
        , success: function(data){
            //var json = $.parseJSON(data); // create an object with the key of the array
            //console.log(data); // where html is the key of array that you want, $response['html'] = "<a>something..</a>";
         }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })
}
