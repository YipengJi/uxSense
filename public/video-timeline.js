var video = document.getElementById('ux-video');
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
//context.drawImage(video, (i/vidTimelineInterval) * 100, 0, 100, 80);
//var dataURL = canvas.toDataURL();
var thumbnail = new Image();
thumbnail.src = 'frames/_initCanvas.png';
thumbnail.onload = function(){
    context.drawImage(thumbnail, 0, 0, 600, 80);
    vidTimelineRecur(i+vidTimelineInterval);
}

