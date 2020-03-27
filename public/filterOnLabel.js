function filterOnLabel(containerID){

    var svg = d3.select("#" + containerID).select('svg')

    var g = svg.select("g")

    var rectclass; 
    var container = document.getElementById(containerID).parentElement.parentElement;
    var collapseheader;
    var filtercontainer;
    var checkedfilters =[];


    if(containerID == 'Emotion'){
        g = svg.select('#emotionrects')
        rectclass = 'emotionrect'

        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].className == "collapsible-header") {
                collapseheader = container.childNodes[i];
                for(var j = 0; j < collapseheader.childNodes.length; j++){
                    if(collapseheader.childNodes[j].className == "filters"){
                        filtercontainer = collapseheader.childNodes[j];
                        var filters = filtercontainer.getElementsByTagName('label');
                        for(var k = 0; k < filters.length; k++){
                            console.log(container)
                            console.log(collapseheader)
                            console.log(filtercontainer)
                            console.log(filters)
                            var inputfield = filters[k].childNodes[1];
                            var spanfield = filters[k].childNodes[3].firstChild.nodeValue;
                            if (inputfield.checked) {
                                checkedfilters.push({'emotion':spanfield})
                            }
                        }
                        break;
                    }
                }
                break;
            }        
        }



    }

    if(containerID == 'Action1'){
        g = svg.select('#action1rects')
        rectclass = 'action1rect'
    }


    setTimeout(showFilters(), 50)

    function showFilters(){
        console.log(checkedfilters)

        if(containerID == 'Emotion'){
            g.selectAll('.'+rectclass).each(function(d){
                if(_.filter(checkedfilters, {'emotion':d.emotion}).length > 0){
                    d3.select(this).attr('opacity', 1)
                } else {
                    d3.select(this).attr('opacity', 0.3)
                }
            })
        }    
    }    

}

setTimeout('filterOnLabel("Emotion")', 1000)
