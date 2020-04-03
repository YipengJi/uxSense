function filterOnLabel(containerID){

    var svg = d3.select("#" + containerID).select('svg')

    var g = svg.select("g")

    var rectclass; 
    var container = document.getElementById(containerID).parentElement.parentElement;
    var collapseheader;
    var filtercontainer;
    var allfilters =[];
    var checkedfilters =[];
    var attrName;


    if(containerID == 'Emotion'){
        g = svg.select('#emotionrects')
        rectclass = 'emotionrect'
        attrName = 'emotion'
    }

    if(containerID == 'Action1'){
        g = svg.select('#action1rects')
        rectclass = 'action1rect'
        attrName = 'action'
    }

    for (var i = 0; i < container.childNodes.length; i++) {
        if (container.childNodes[i].className == "collapsible-header") {
            collapseheader = container.childNodes[i];
            for(var j = 0; j < collapseheader.childNodes.length; j++){
                if(collapseheader.childNodes[j].className == "filters"){
                    filtercontainer = collapseheader.childNodes[j];
                    var filters = filtercontainer.getElementsByTagName('label');
                    for(var k = 0; k < filters.length; k++){
                        //console.log(container)
                        //console.log(collapseheader)
                        //console.log(filtercontainer)
                        //console.log(filters)
                        var inputfield = filters[k].childNodes[1];
                        var spanfield = filters[k].childNodes[3].firstChild.nodeValue;
                        allfilters.push({[attrName]:spanfield});
                        if (inputfield.checked) {
                            checkedfilters.push({[attrName]:spanfield})
                        }
                    }
                    break;
                }
            }
            break;
        }        
    }

    if(checkedfilters.length>0){
        showFilters(checkedfilters, rectclass, containerID, g)
    } else {
        showFilters(allfilters, rectclass, containerID, g)
    }
}

function showFilters(checkedfilters, rectclass, containerID, g){
    //console.log(checkedfilters)
    if(containerID == 'Emotion'){
        g.selectAll('.'+rectclass).each(function(d){
            if(_.filter(checkedfilters, {'emotion':d.emotion}).length > 0){
                d3.select(this).attr('opacity', 1)
            } else {
                d3.select(this).attr('opacity', 0.3)
            }
        })
    }    
    if(containerID == 'Action1'){
        g.selectAll('.'+rectclass).each(function(d){
            if(_.filter(checkedfilters, {'action':d.action}).length > 0){
                d3.select(this).attr('opacity', 1)
            } else {
                d3.select(this).attr('opacity', 0.3)
            }
        })
    }    
}    


setTimeout('filterOnLabel("Emotion")', 1000)
setTimeout('filterOnLabel("Action1")', 1000)

d3.selectAll('.collapsible-header').selectAll('span').on('click', function(){
    var thiscontainerID = d3.select(this.parentElement.parentElement.parentElement.parentElement).select('.timelineholder').attr('id');
    setTimeout("filterOnLabel('"+thiscontainerID+"')", 50);
})