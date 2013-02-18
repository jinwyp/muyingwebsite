var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
 

var CounterSchema = new Schema({
    _id : String,
    countnext    : {type: Number, default: 1}
});
 
CounterSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

CounterSchema.statics.increment = function (schemaName, callback) {
    return this.collection.findAndModify({ _id: schemaName }, [], { $inc: { countnext: 1 } }, callback);
};

 
module.exports = mongoose.model('Counter', CounterSchema);