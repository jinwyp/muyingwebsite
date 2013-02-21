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
                pid : result.countnext,
                productid : result.countnext,
                productname : req.body.productname,
                productintro : req.body.productintro,
                producturl : req.body.producturl,
                productredtitle : req.body.productredtitle,
                productredtitleurl : req.body.productredtitleurl,
                productpriceshowtext : req.body.productpriceshowtext,
                productmarketprice : req.body.productmarketprice,
                productnormailprice : req.body.productnormailprice,
                producttimelimitedprice : req.body.producttimelimitedprice,
                starttime : req.body.starttime,
                endtime : req.body.endtime,
                limitedstock : req.body.limitedstock,
                userlimitedstock : req.body.userlimitedstock,
                totalstock : req.body.totalstock,
                productquantity : req.body.productquantity,
                combostarttime : req.body.combostarttime,
                comboendtime : req.body.comboendtime,
                comboquantity1 : req.body.comboquantity1,
                comboprice1 : req.body.comboprice1,
                comboquantity2 : req.body.comboquantity2,
                comboprice2 : req.body.comboprice2,
                comboquantity3: req.body.comboquantity3,
                comboprice3 : req.body.comboprice3,
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

    console.log('Prepare Updating productid: ' +  req.params.id );

    if(req.params.id == req.body.productid){
        ProductModel.findOneAndUpdate(query,  {
            productname : req.body.productname,
            productintro : req.body.productintro,
            producturl : req.body.producturl,
            productredtitle : req.body.productredtitle,
            productredtitleurl : req.body.productredtitleurl,
            productpriceshowtext : req.body.productpriceshowtext,
            productmarketprice : req.body.productmarketprice,
            productnormailprice : req.body.productnormailprice,
            producttimelimitedprice : req.body.producttimelimitedprice,
            starttime : new Date(req.body.starttime),
            endtime : new Date(req.body.endtime),
            limitedstock : req.body.limitedstock,
            userlimitedstock : req.body.userlimitedstock,
            totalstock : req.body.totalstock,
            productquantity : req.body.productquantity,
            combostarttime : new Date(req.body.combostarttime),
            comboendtime : new Date(req.body.comboendtime),
            comboquantity1 : req.body.comboquantity1,
            comboprice1 : req.body.comboprice1,
            comboquantity2 : req.body.comboquantity2,
            comboprice2 : req.body.comboprice2,
            comboquantity3: req.body.comboquantity3,
            comboprice3 : req.body.comboprice3,
            updatedate : new Date()  } ,  function( err, product ){
                if (err) {
                    console.log('Error updating product: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {

                    console.log(' product updated');
                    res.send(product);
                }
        });
    }else{
        res.send('productid not found');
        console.log('productid not found');
    };


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