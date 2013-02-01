var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    // yay!
});

var Schema   = mongoose.Schema;

var EmailSchema = new Schema({
    emailid    : Number,
    emailname  : String,
    couponcode : String,
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
    var email1 = new EmailModel({
        emailid :  req.params.id
    });

    EmailModel.find({ emailid: id }, function (err, emails) {
        if (err) {

        }else{
            console.log(emails);
            res.send(emails);
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
            return;
        }else{
            var email1 = new EmailModel({
                emailid : result.countnext,
                emailname : req.body.emailname,
                couponcode : req.body.couponcode,
                updatedate : new Date()
            });
            email1.save( function( err, email1, count ){
                if (err){
                    console.log('Error adding email: ' + err);
                }else{
                    console.log('Adding email: ' + JSON.stringify(email1));
//            console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(email1);
                }
            });
            return;
        }
    });
};


exports.updateEmail = function(req, res) {
//    var id = req.params.id;
    var id = req.body.emailid;
    var email = req.body;
    console.log('Updating email: ' + id);
    console.log(JSON.stringify(email));
    db.collection('emails', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating email: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(email);
            }
        });
    });
}

exports.deleteEmail = function(req, res) {
    var id = req.params.id;
    console.log('Deleting email: ' + id);
    db.collection('emails', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}


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