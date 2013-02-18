// The Reply model
 
var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,ObjectId = Schema.ObjectId;
 
var ReplySchema = new Schema({
	thread: ObjectId,
	date: {type: Date, default: Date.now},
	author: {type: String, default: 'Anon'},
	replycontent: String
});



 
module.exports = mongoose.model('Reply', postSchema);