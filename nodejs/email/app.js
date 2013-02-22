/**
 * Created with JetBrains WebStorm.
 * User: Janker Zhang
 * Date: 13-1-30
 * Time: 下午3:34
 * To change this template use File | Settings | File Templates.
 */
var express = require('express'),
    Validator = require('validator').Validator,
    exphbs = require('express3-handlebars'),
//    ejs = require('ejs'),
//    emails = require('./backend/models/emails'),
    products = require('./backend/api/productlist');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();


//app.engine('html', ejs.renderFile);


app.configure(function() {
    
    app.engine('handlebars', exphbs({defaultLayout: 'maintemplate', layoutsDir:"backend/views/layouts/"}));
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/backend/views');

    // app.use(express.favicon());
//    app.use(express.compress());    //启用压缩
    // app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret goes here' }));
    app.use(express.bodyParser()); // parse json request bodies (as well as others), and place the result in req.body

    app.use(app.router);
    app.use(express.csrf());
    app.use(express.static(__dirname + '/frontend'));
//    app.use(express.static(path.join(__dirname, '/frontend'), {maxAge:31557600000}));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res){
    res.render('adminemaillist2');
});

//app.get('/adminemail', function(req, res){
//    res.render('adminemail');
//});
//
//app.get('/adminemaillist', function(req, res){
//    res.render('adminemail');
//});

//app.get('/rest/emails', emails.findAll);
//app.get('/rest/emails/:id', emails.findById);
//app.post('/rest/emails', emails.addEmail);
//app.put('/rest/emails/:id', emails.updateEmail);
//app.delete('/rest/emails/:id', emails.deleteEmail);


app.get('/rest/products', products.findAll);
app.get('/rest/products/:id', products.findById);
app.post('/rest/products', products.addProduct);
app.put('/rest/products/:id', products.updateProduct);
app.delete('/rest/products/:id', products.deleteProduct);


app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});


var server = app.listen(3000);
var io = require('socket.io').listen(server);

console.log('Listening on port 3000, good');




io.sockets.on('connection', function (socket) {

    /**
     * todo:create
     *
     * called when we .save() our new todo
     *
     * we listen on model namespace, but emit
     * on the collection namespace
     */

//    socket.on('todo:create', function (data, callback) {
//        var id = guid.gen()
//            , todo = db.set('/todo/' + id, data)
//            , json = todo._attributes;
//
//        socket.emit('todos:create', json);
//        socket.broadcast.emit('todos:create', json);
//        callback(null, json);
//    });

    /**
     * todos:read
     *
     * called when we .fetch() our collection
     * in the client-side router
     */

    socket.on('product:read', function (data, callback) {
        var json = products.socketfindById(data);
        console.log(products.socketfindById(data));
        socket.emit('product:read', json);
        callback(null, json);
    });

    /**
     * todos:update
     *
     * called when we .save() our model
     * after toggling its completed status
     */

//    socket.on('todos:update', function (data, callback) {
//        var todo = db.get('/todo/' + data.id);
//        todo.set(data);
//
//        var json = todo._attributes;
//
//        socket.emit('todos/' + data.id + ':update', json);
//        socket.broadcast.emit('todos/' + data.id + ':update', json);
//        callback(null, json);
//    });

    /**
     * todos:delete
     *
     * called when we .destroy() our model
     */

//    socket.on('todos:delete', function (data, callback) {
//        var json = db.get('/todo/' + data.id)._attributes;
//
//        db.del('/todo/' + data.id);
//
//        socket.emit('todos/' + data.id + ':delete', json);
//        socket.broadcast.emit('todos/' + data.id + ':delete', json);
//        callback(null, json);
//    });

});








// Have the server start listening on port 3000.

