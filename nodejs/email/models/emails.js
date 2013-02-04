var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // yay!
});

var Schema   = mongoose.Schema;

var ProductSchema = new Schema({
    emailid    : Number,
    productfinalprice  : Number,
    productmarketprice  : Number,
    productid    : Number,
    productintro    : String,
    productname : String,
    productpic : String,
    producturl : String
});


var EmailSchema = new Schema({
    emailid    : Number,
    emailname  : String,
    couponcode : String,
    products : [ProductSchema],
    updatedate : Date
});

var CountersSchema = new Schema({
    _id : String,
    countnext    : {type: Number, default: 1}
});

CountersSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

CountersSchema.statics.increment = function (schemaName, callback) {
    return this.collection.findAndModify({ _id: schemaName }, [], { $inc: { countnext: 1 } }, callback);
};

var EmailModel = mongoose.model( 'Email', EmailSchema );
var CountersModel = mongoose.model( 'Counters', CountersSchema );
var Counter1 = new CountersModel({
    _id :'email'
});
Counter1.save();


//db.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'testdb' database");
//        db.collection('emails', {safe:true}, function(err, collection) {
//            if (err) {
//                console.log("The 'emaildb' collection doesn't exist. Creating it with sample data...");
////                populateDB();
//            }else{
//
//            }
//        });
//    }
//});

exports.findById = function(req, res) {
    var id = req.params.id;

    EmailModel.findOne({ emailid: id }, function (err, data) {
        if (err) {
            console.log(err);
        }else{
            res.send(data);
        }
    });
};

exports.findAll = function(req, res) {
    EmailModel.find().sort('-updatedate').execFind(function (err,data) {
        res.send(data);
    });
};


exports.addEmail = function(req, res) {

    CountersModel.increment('email', function (err, result) {
        if (err) {
            console.error('Counter on emailid save error: ' + err);
        }else{
            var email1 = new EmailModel({
                emailid : result.countnext,
                emailname : req.body.emailname,
                couponcode : req.body.couponcode,
                products : req.body.products,
                updatedate : new Date()
            });
            email1.save( function( err, email, count ){
                if (err){
                    console.log('Error adding email: ' + err);
                }else{
                    console.log('Adding email: ' + JSON.stringify(email));
//            console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(email);
                }
            });
        }
    });
};


exports.updateEmail = function(req, res) {
    var query = { emailid: req.params.id };

    var email1 = new EmailModel({
        _id      : req.body._id,
        emailname : req.body.emailname,
        couponcode : req.body.couponcode,
        products : req.body.products,
        updatedate : new Date()
    });
    console.log('Updating email: ' +  req.params.id);
    console.log(JSON.stringify(email1));

    EmailModel.findOneAndUpdate(query,  {emailname: req.body.emailname,  couponcode : req.body.couponcode, products : req.body.products, updatedate : new Date()} ,  function( err, email ){
        if (err) {
            console.log('Error updating email: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log(' document(s) updated');
            res.send(email);
        }
    });
};


exports.deleteEmail = function(req, res) {
    var query = { emailid: req.params.id };
    var id = req.params.id;
    console.log('Deleting email: ' + id);
    EmailModel.findOneAndRemove(query, function (err, email) {
        if (!err) {
            console.log("document(s) deleted");
            return res.send(email);
        } else {
            console.log('An error has occurred - ' + err);
        }
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var emails = [
        {
            name: "CHATEAU DE SAINT COSME",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "France",
            region: "Southern Rhone",
            description: "The aromas of fruit and spice...",
            picture: "saint_cosme.jpg"
        },
        {
            name: "LAN RIOJA CRIANZA",
            year: "2006",
            grapes: "Tempranillo",
            country: "Spain",
            region: "Rioja",
            description: "A resurgence of interest in boutique vineyards...",
            picture: "lan_rioja.jpg"
        }];

    db.collection('emails', function(err, collection) {
        collection.insert(emails, {safe:true}, function(err, result) {});
        console.log("save to 'testdb' database");
    });

};