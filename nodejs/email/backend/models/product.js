var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // yay!
// });


var ProductSchema = new Schema({
    pid : Number,
    productid    : Number,
    productname  : String,
    productintro : String,
    producturl : String,
    productpic : String,
    productredtitle : String,
    productredtitleurl : String,
    productpriceshowtext: String,
    productmarketprice : Number,
    productnormailprice : Number,
    producttimelimitedprice : Number,
    starttime : Date,
    endtime : Date,
    limitedstock : Number,
    userlimitedstock : Number,
    totalstock : Number,
    productquantity : Number,
    productfinalprice : Number,
    combostarttime : Date,
    comboendtime : Date,
    comboquantity1 : Number,
    comboprice1 : Number,
    comboquantity2 : Number,
    comboprice2 : Number,
    comboquantity3 : Number,
    comboprice3 : Number,
    promotiontab : String,
    updatedate : Date
});

module.exports = mongoose.model('Product', ProductSchema);







//db.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'testdb' database");
//        db.collection('Products', {safe:true}, function(err, collection) {
//            if (err) {
//                console.log("The 'Productdb' collection doesn't exist. Creating it with sample data...");
////                populateDB();
//            }else{
//
//            }
//        });
//    }
//});



/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {


};

