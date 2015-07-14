var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  message: String
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;