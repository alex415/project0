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

 // submit form to create new message
 $newMessage.on('submit', function(event) {
   event.preventDefault();

   // create new message object from form data
   var messageTitle = $('#message-title').val();
   var messageData = {message: messageTitle};

   // store our new message
   messages.push(messageData);
   console.log(messages);
   var index = messages.indexOf(messageData);

   // append our new message to the page
   var $blog = $(messageTemplate(messageData));
   $blog.attr('data-index', index);
   $messageList.append($blog);

   // reset the form
   $newMessage[0].reset();
   $('#message-title').focus();
 });

 // remove feeds from model and view
 $messageList.on("click", ".delete", function () {
   var $feed = $(this).closest(".feeds");
   var index = $feed.attr('data-index');

   // remove message from the `messages` array (model)
   messages.splice(index, 1);
   console.log(messages);

   // remove message from the DOM (view)
   $feed.remove();

   // reset indexes in DOM to match `messages` array
   // $.each loops through DOM elements
   $('.feeds').each(function(index) {
     $(this).attr('data-index', index);
   });
 });

 

});