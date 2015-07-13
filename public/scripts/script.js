// CLIENT-SIDE JAVASCRIPT

$(document).ready(function() {

// NAVBAR FADE
$(function() {
  $(window).scroll(function(){
    var scrollTop = $(window).scrollTop();
    if(scrollTop != 0)
      $('.navbar').stop().animate({'opacity':'0.2'},400);
    else  
      $('.navbar').stop().animate({'opacity':'1'},400);
  });
  
  $('.navbar').hover(
    function (e) {
      var scrollTop = $(window).scrollTop();
      if(scrollTop != 0){
        $('.navbar').stop().animate({'opacity':'1'},400);
      }
    },
    function (e) {
      var scrollTop = $(window).scrollTop();
      if(scrollTop != 0){
        $('.navbar').stop().animate({'opacity':'0.2'},400);
      }
    }
  );
// END OF NAVBAR FADE

$(function() {

 // form to create new message
 var $newMessage = $('#new-message');

 // element to hold our list of messages
 var $messageList = $('#message-list');

 // todo template
 var messageTemplate = _.template($('#message-template').html());

 // `messages` array is our model (holds our data)
 // contains test (or "seed") data
 var messages = [
   {message: "The hacker group Anonymous appears to have posted a video threatening Kanye West. The notorious 'hacktivists' uploaded a seven-and-a-half minute tirade, claiming the rapper was an annoying, classlessspoiled little brat, who stands for nothing of value, and is merely a 'new slave 'being used by the entertainment industry."},
   {message: "Anonymous has threatened Israel with “the electronic holocaust” which, the group vowed, would “erase it from cyberspace” on April 7 for “crimes” in Palestine. Anonymous planned yet another cyberattack for just over a week before Holocaust Remembrance Day."},
   {message: "FBI chief James Comey says that hackers who targeted Sony's networks over film The Interview were sloppy in their methods -- and the US Director of National Intelligence doesn't think North Korea has much of a sense of humor."}
 ];

 // append existing todos (from seed data) to `$messageList`
 _.each(messages, function (feeds, index) {
   var $post = $(messageTemplate(feeds));
   $post.attr('data-index', index);
   $messageList.append($post);
});

 // MESSAGE CONTROLLER
 $(function() {

   // `phrasesController` holds all our phrase funtionality
   var phrasesController = {
     
     // compile phrase template
     template: _.template($('#message-template').html()),

     // pass each phrase object through template and append to view
     render: function(phraseObj) {
       var $phraseHtml = $(phrasesController.template(phraseObj));
       $('#phrase-list').append($phraseHtml);
     },

     all: function() {
       // send GET request to server to get all phrases
       $.get('/api/phrases', function(data) {
         var allPhrases = data;
         
         // iterate through each phrase
         _.each(allPhrases, function(phrase) {
           phrasesController.render(phrase);
         });
         
         // add event-handers for updating/deleting
         phrasesController.addEventHandlers();
       });
     },

     create: function(newWord, newDefinition) {
       var phraseData = {word: newWord, definition: newDefinition};
       
       // send POST request to server to create new phrase
       $.post('/api/phrases', phraseData, function(data) {
         var newPhrase = data;
         phrasesController.render(newPhrase);
       });
     },

     update: function(phraseId, updatedWord, updatedDefinition) {
       // send PUT request to server to update phrase
       $.ajax({
         type: 'PUT',
         url: '/api/phrases/' + phraseId,
         data: {
           word: updatedWord,
           definition: updatedDefinition
         },
         success: function(data) {
           var updatedPhrase = data;

           // replace existing phrase in view with updated phrase
           var $phraseHtml = $(phrasesController.template(updatedPhrase));
           $('#phrase-' + phraseId).replaceWith($phraseHtml);
         }
       });
     },
     
     delete: function(phraseId) {
       // send DELETE request to server to delete phrase
       $.ajax({
         type: 'DELETE',
         url: '/api/phrases/' + phraseId,
         success: function(data) {
           
           // remove deleted phrase from view
           $('#phrase-' + phraseId).remove();
         }
       });
     },

     // add event-handlers to phrases for updating/deleting
     addEventHandlers: function() {
       $('#phrase-list')

         // for update: submit event on `.update-phrase` form
         .on('submit', '.update-phrase', function(event) {
           event.preventDefault();
           
           // find the phrase's id (stored in HTML as `data-id`)
           var phraseId = $(this).closest('.phrase').attr('data-id');
           
           // udpate the phrase with form data
           var updatedWord = $(this).find('.updated-word').val();
           var updatedDefinition = $(this).find('.updated-definition').val();
           phrasesController.update(phraseId, updatedWord, updatedDefinition);
         })
         
         // for delete: click event on `.delete-phrase` button
         .on('click', '.delete-phrase', function(event) {
           event.preventDefault();

           // find the phrase's id
           var phraseId = $(this).closest('.phrase').attr('data-id');
           
           // delete the phrase
           phrasesController.delete(phraseId);
         });
     },

     setupView: function() {
       // append existing phrases to view
       phrasesController.all();
       
       // add event-handler to new-phrase form
       $('#new-phrase').on('submit', function(event) {
         event.preventDefault();
         
         // create new phrase with form data
         var newWord = $('#new-word').val();
         var newDefinition = $('#new-definition').val();
         phrasesController.create(newWord, newDefinition);
         
         // reset the form
         $(this)[0].reset();
         $('#new-word').focus();
       });
     }
   };

   phrasesController.setupView();

 });













 // // submit form to create new message
 // $newMessage.on('submit', function(event) {
 //   event.preventDefault();

 //   // create new message object from form data
 //   var messageTitle = $('#message-title').val();
 //   var messageData = {message: messageTitle};

 //   // store our new message
 //   messages.push(messageData);
 //   console.log(messages);
 //   var index = messages.indexOf(messageData);

 //   // append our new message to the page
 //   var $blog = $(messageTemplate(messageData));
 //   $blog.attr('data-index', index);
 //   $messageList.append($blog);

 //   // reset the form
 //   $newMessage[0].reset();
 //   $('#message-title').focus();
 // });

 // remove feeds from model and view
 // $messageList.on("click", ".delete", function () {
 //   var $feed = $(this).closest(".feeds");
 //   var index = $feed.attr('data-index');

 //   // remove message from the `messages` array (model)
 //   messages.splice(index, 1);
 //   console.log(messages);

 //   // remove message from the DOM (view)
 //   $feed.remove();

 //   // reset indexes in DOM to match `messages` array
 //   // $.each loops through DOM elements
 //   $('.feeds').each(function(index) {
 //     $(this).attr('data-index', index);
 //   });
 // });
});
});










});