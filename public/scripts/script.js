// CLIENT-SIDE JAVASCRIPT

$(function() {

  // NAVBAR FADE
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

   // `messagesController` holds all our message funtionality
   var messagesController = {
     
     // compile message template
     template: _.template($('#message-template').html()),

     // pass each message object through template and append to view
     render: function(messageObj) {
       var $messageHtml = $(messagesController.template(messageObj));
       $('#message-list').append($messageHtml);
     },

     all: function() {
       // send GET request to server to get all messages
       $.get('/api/messages', function(data) {
         var allmessages = data;
         
         // iterate through each message
         _.each(allmessages, function(message) {
           messagesController.render(message);
         });
         
         // add event-handers for updating/deleting
         messagesController.addEventHandlers();
       });
     },

     create: function(newMessage) {
       var messageData = {message: newMessage};
       
       // send POST request to server to create new message
       $.post('/api/messages', messageData, function(data) {
         var newMessage = data;
         messagesController.render(newMessage);
       });
     },

     update: function(messageId, updatedMessage) {
       // send PUT request to server to update message
       $.ajax({
         type: 'PUT',
         url: '/api/messages/' + messageId,
         data: {
           message: updatedMessage,
         },
         success: function(data) {
           var updatedMessage = data;

           // replace existing message in view with updated message
           var $messageHtml = $(messagesController.template(updatedMessage));
           $('#message-' + messageId).replaceWith($messageHtml);
         }
       });
     },
     
     delete: function(messageId) {
       // send DELETE request to server to delete message
       $.ajax({
         type: 'DELETE',
         url: '/api/messages/' + messageId,
         success: function(data) {
           
           // remove deleted message from view
           $('#message-' + messageId).remove();
         }
       });
     },

     // add event-handlers to messages for updating/deleting
     addEventHandlers: function() {
       $('#message-list')

         // for update: submit event on `.update-message` form
         .on('submit', '.update-message', function(event) {
           event.preventDefault();
           
           // find the message's id (stored in HTML as `data-id`)
           var messageId = $(this).closest('.message').attr('data-id');
           
           // udpate the message with form data
           var updatedMessage = $(this).find('.updated-message').val();
           messagesController.update(messageId, updatedMessage);
         })
         
         // for delete: click event on `.delete-message` button
         .on('click', '.delete-message', function(event) {
           event.preventDefault();

           // find the message's id
           var messageId = $(this).closest('.message').attr('data-id');
           
           // delete the message
           messagesController.delete(messageId);
         });
     },

     setupView: function() {
       // append existing messages to view
       messagesController.all();
       
       // add event-handler to new-message form
       $('#new-message').on('submit', function(event) {
         event.preventDefault();
         
         // create new message with form data
         var newMessage = $('#new-message').val();
         messagesController.create(newMessage);
         
         // reset the form
         $(this)[0].reset();
         $('#new-message').focus();
      });
     }
   };

   messagesController.setupView();
 });