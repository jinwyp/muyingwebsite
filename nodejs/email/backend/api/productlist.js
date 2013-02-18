var ProductModel = require('../models/product.js');
var CounterModel = require('../models/counter.js');




var Counter1 = new CounterModel({
    _id :'product'
});
Counter1.save();



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

    CounterModel.increment('product', function (err, result) {
        if (err) {
            console.error('Counter on productid save error: ' + err);
        }else{
            var product1 = new ProductModel({
                productid : result.countnext,
                productname : req.body.productname,
                productintro : req.body.productintro,
                producturl : req.body.producturl,
                productmarketprice : req.body.productmarketprice,
                productnormailprice : req.body.productnormailprice,
                producttimelimitedprice : req.body.producttimelimitedprice,
                starttime : req.body.starttime,
                endtime : req.body.endtime,
                limitedstock : req.body.limitedstock,
                userlimitedstock : req.body.userlimitedstock,
                totalstock : req.body.totalstock,
                productfinalprice : req.body.productfinalprice,
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


    console.log('Updating productid: ' +  req.params.id);

    ProductModel.findOneAndUpdate(query,  {                
    			productname : req.body.productname,
                productintro : req.body.productintro,
                producturl : req.body.producturl,
                productmarketprice : req.body.productmarketprice,
                productnormailprice : req.body.productnormailprice,
                producttimelimitedprice : req.body.producttimelimitedprice,
                starttime : req.body.starttime,
                endtime : req.body.endtime,
                limitedstock : req.body.limitedstock,
                userlimitedstock : req.body.userlimitedstock,
                totalstock : req.body.totalstock,
                productfinalprice : req.body.productfinalprice, 
                updatedate : new Date()} ,  function( err, product ){
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