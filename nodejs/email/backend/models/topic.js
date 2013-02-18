// The Topic model
 
var mongoose = require('mongoose')
, Schema = mongoose.Schema;
 
var TopicSchema = new Schema({
	title: String,
	postdate: {type: Date, default: Date.now},
	author: {type: String, default: 'Anon'}
});
 
module.exports = mongoose.model('Topic', TopicSchema);