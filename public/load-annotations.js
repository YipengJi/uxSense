 /**
  * Need to continuously check if annotations table has been updated.
  */

  var tdata;

  d3.json('userAnnotations/data.json', function(rawdata){
    tdata = _.sortBy(rawdata, [function(o) { return parseFloat(o.timestamp); }])
    annotationTabPop();
  })

function annotationTabPop(){
    var tbody = d3.select('#annotation-table')
    .select('tbody')
    .data(tdata)
    
    tdata.forEach(function(d){
        var row = tbody.append('tr').datum(d)
      
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
}

