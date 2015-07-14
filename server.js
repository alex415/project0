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

// pre-seeded messages data
var messages = [
   {id: 1, message: "The hacker group Anonymous appears to have posted a video threatening Kanye West. The notorious 'hacktivists' uploaded a seven-and-a-half minute tirade, claiming the rapper was an annoying, classlessspoiled little brat, who stands for nothing of value, and is merely a 'new slave 'being used by the entertainment industry."},
   {id: 2, message: "Anonymous has threatened Israel with “the electronic holocaust” which, the group vowed, would “erase it from cyberspace” on April 7 for “crimes” in Palestine. Anonymous planned yet another cyberattack for just over a week before Holocaust Remembrance Day."},
   {id: 3, message: "FBI chief James Comey says that hackers who targeted Sony's networks over film The Interview were sloppy in their methods -- and the US Director of National Intelligence doesn't think North Korea has much of a sense of humor."}
 ];

// STATIC ROUTES

// SERVING HTML FILE
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// API ROUTES

// ROUTE FOR SINGLE ID
app.get('/api/messages/:id', function(req, res) {
  // if no message id is found, alert the user
  if(messages.length < req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No post found');
  } 
  // find a specific id
    var singleMessage = parseInt(req.params.id);
    var findId = _.findWhere(messages, {id: singleMessage});
  res.json(findId);
});

// MESSAGES INDEX
app.get('/api/messages', function(req, res) {
  // send all messages as JSON response
  res.json(messages);
});

// CREATE NEW MESSAGE
app.post('/api/messages', function (req, res) {
  // grab params (word and definition) from form data

  var newMessage = req.body;
  
  // set sequential id (last id in `messages` array + 1)
    if (messages.length > 0) {
      newMessage.id = messages[messages.length - 1].id +  1;
    } else {
      newMessage.id = 0;
    }

    // add newMessage to `messages` array
    messages.push(newMessage);
    
    // send newMessage as JSON response
    res.json(newMessage);
  });

// UPDATE MESSAGES
app.put('/api/messages/:id', function (req, res) {

 // set the value of the id
 var targetId = parseInt(req.params.id);

 // find item in messages array matching the id
 var foundMessage = _.findWhere(messages, {id: targetId});

 // update the messages message
 foundMessage.message = req.body.message;

 // send back edited object
 res.json(foundMessage);
});

// DELETE MESSAGE
app.delete('/api/messages/:id', function (req, res) {
  
  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `messages` array matching the id
  var foundMessage = _.findWhere(messages, {id: targetId});

  // get the index of the found item
  var index = messages.indexOf(foundMessage);
  
  // remove the item at that index, only remove 1 item
  messages.splice(index, 1);
  
  // send back deleted object
  res.json(foundMessage);
});

// set server to localhost:3000
app.listen(3000, function() {
  console.log('server started on localhost:3000');
});