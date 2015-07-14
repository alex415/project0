// SERVER-SIDE JAVASCRIPT

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));

// include mongoose
var mongoose = require('mongoose');

// include our module from the other file
var Post = require("./models/post");

// connect to db
mongoose.connect('mongodb://localhost/microblog');

// pre-seeded messages data
var messages = [
   {id: 1, message: "The hacker group Anonymous appears to have posted a video threatening Kanye West. The notorious 'hacktivists' uploaded a seven-and-a-half minute tirade, claiming the rapper was an annoying, classlessspoiled little brat, who stands for nothing of value, and is merely a 'new slave 'being used by the entertainment industry."},
   {id: 2, message: "Anonymous has threatened Israel with “the electronic holocaust” which, the group vowed, would “erase it from cyberspace” on April 7 for “crimes” in Palestine. Anonymous planned yet another cyberattack for just over a week before Holocaust Remembrance Day."},
   {id: 3, message: "FBI chief James Comey says that hackers who targeted Sony's networks over film The Interview were sloppy in their methods -- and the US Director of National Intelligence doesn't think North Korea has much of a sense of humor."}
 ];

// STATIC ROUTES

// SERVES HTML FILE
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// API ROUTES

// GET ALL MESSAGES
app.get('/api/messages', function (req, res) {
  // find all phrases in db
  Message.find(function (err, messages) {
    res.json(messages);
  });
});

// CREATE NEW MESSAGE
app.post('/api/messages', function (req, res) {
  // use params (author and text) from request body
  // to create a new message
  var newMessage = new Message({
    message: req.body.message
  });

  // save new message in db
  newMessage.save(function (err, savedMessage) { 
    if (err) {
      console.log("error: ",err);
      res.status(500).send(err);
    } else {
      // once saved, send the new message as JSON response
      res.json(savedMessage);
    }
  });
});

// GET A SINGLE MESSAGE
app.get('/api/messages/:id', function(req, res) {

  // take the value of the id from the url parameter
  // note that now we are NOT using parseInt
  var targetId = req.params.id

  // find item in database matching the id
  Message.findOne({_id: targetId}, function(err, foundMessage){
    console.log(foundMessage);
    if(err){
      console.log("error: ", err);
      res.status(500).send(err);
    } else {
      // send back post object
      res.json(foundMessage);
    }
  });

});

// UPDATE SINGLE MESSAGE
app.put('/api/messages/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = req.params.id;

  // find item in `messages` array matching the id
  Messages.findOne({_id: targetId}, function(err, foundMessage){
    console.log(foundMessage); 

    if(err){
      res.status(500).send(err);

    } else {
      // update the messages's message
      foundMessage.author = req.body.message;

      // save the changes
      foundMessage.save(function(err, savedMessage){
        if (err){
          res.status(500).send(err);
        } else {
          // send back edited object
          res.json(savedMessage);
        }
      });
    }

  });

});

// DELETE POST
app.delete('/api/messages/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = req.params.id;

 // remove item from the db that matches the id
   Message.findOneAndRemove({_id: targetId}, function (err, deletedMessage) {
    if (err){
      res.status(500).send(err);
    } else {
      // send back deleted post
      res.json(deletedMessage);
  });
});

// set server to localhost:3000
app.listen(3000, function() {
  console.log('server started on localhost:3000');
});