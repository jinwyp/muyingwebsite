var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // yay!
});


var Schema   = mongoose.Schema;

var ProductDetailSchema = new Schema({
    productid    : Number,
    productname  : String,
    productintro : String,
    producturl : String,
    productpic : String,
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

var ProductModel = mongoose.model( 'product', ProductDetailSchema );
var CountersModel = mongoose.model( 'Counters', CountersSchema );
var Counter1 = new CountersModel({
    _id :'product'
});
Counter1.save();


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

exports.findById = function(req, res) {
    var id = req.params.id;

    ProductModel.findOne({ productid: id }, function (err, data) {
        if (err) {
            console.log(err);
        }else{
            res.send(data);
        }
    });
};

exports.findAll = function(req, res) {
    ProductModel.find().sort('-updatedate').execFind(function (err,data) {
        res.send(data);
    });
};


exports.addProduct = function(req, res) {

    CountersModel.increment('product', function (err, result) {
        if (err) {
            console.error('Counter on productid save error: ' + err);
        }else{
            var product1 = new ProductModel({
                productid : result.countnext,
                productname : req.body.productname,
                productintro : req.body.productintro,
                productnormailprice : req.body.productnormailprice,
                updatedate : new Date()
            });
            product1.save( function( err, product, count ){
                if (err){
                    console.log('Error adding product: ' + err);
                }else{
                    console.log('Adding product: ' + JSON.stringify(product));
                    res.send(product);
                }
            });
        }
    });
};


exports.updateProduct = function(req, res) {
    var query = { productid: req.params.id };


    console.log('Updating product: ' +  req.params.id);

    ProductModel.findOneAndUpdate(query,  {productname: req.body.productname,  productintro : req.body.productintro, productnormailprice : req.body.productnormailprice, updatedate : new Date()} ,  function( err, product ){
        if (err) {
            console.log('Error updating product: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log(' document(s) updated');
            res.send(product);
        }
    });
};


exports.deleteProduct = function(req, res) {
    var query = { productid: req.params.id };
    var id = req.params.id;
    console.log('Deleting product: ' + id);
    ProductModel.findOneAndRemove(query, function (err, product) {
        if (!err) {
            console.log("document(s) deleted");
            return res.send(product);
        } else {
            console.log('An error has occurred - ' + err);
        }
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {


};

db.close();