function interactiontracking(d, eventUIElement, eventObject, eventTrigger, eventSupplemental = ''){//, d3Event){
    //Track event
    $.ajax({ 
        url: '/log',
        type: 'POST',
        cache: false, 
        data: { 
            data: d, 
            event: {
                main:JSON.stringify(d3.event),
                meta: {
                    uielement: eventUIElement, 
                    object: eventObject, 
                    trigger: eventTrigger, 
                    timestamp:(new Date().getTime()), 
                    supplemental:eventSupplemental
                }
            }
        }, 
        success: function(){
            //alert('Success!')
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err)
        }
    })

}
