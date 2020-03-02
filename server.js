const express = require('express'); // main library for server-client routing
const fs = require('fs'); // file system

const multer = require('multer'); // file storing middleware
const bodyParser = require('body-parser'); //cleans our req.body

var app = express();

/**
 * handle body requests, account for JSON parsing
 */
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());

/**
 * MULTER CONFIG: we will want to set this up for our server video storage
 */

/*
const multerConfig = {
    
  storage: multer.diskStorage({ //Setup where the user's file will go
    destination: function(req, file, next){
      next(null, './uploads');
    },   
      
    //Then give the file a unique name
    filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
    }
  }),   
  
  //A means of ensuring only videos are uploaded. 
  fileFilter: function(req, file, next){
        if(!file){
          next();
        }
      const video = file.mimetype.startsWith('video/');
      if(video){
        console.log('video uploaded');
        next(null, true);
      } else {
        console.log("file not supported");
        
        //TODO:  A better message response to user on failure.
        return next();
      }
  }
};
*/

/**
 * ...But for now, let's just run the app. 
 */
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.htm')
})

app.listen(3000, function () {
    console.log('Listening on port 3000!')
  });
  
//  app.set('view engine', 'ejs');

app.post('/log', function (req, res){

  //todo: instead of console logging, we need to write to fs somewhere.
    console.log(req.body);
    console.log('req received');
    res.redirect('/');
 
 });

