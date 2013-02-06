/**
 * Created with JetBrains WebStorm.
 * User: Janker Zhang
 * Date: 13-1-30
 * Time: 下午3:34
 * To change this template use File | Settings | File Templates.
 */
var express = require('express'),
    Validator = require('validator').Validator,
    exphbs  = require('express3-handlebars'),
    emails = require('./models/emails');

var app = express();


app.engine('handlebars', exphbs({defaultLayout: 'maintemplate'}));
app.configure(function() {

    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret goes here' }));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.csrf());
    app.use(express.static(__dirname + '/public'));
});



app.get('/', function(req, res){
    res.render('adminemaillist');
});

//app.get('/adminemail', function(req, res){
//    res.render('adminemail');
//});
//
//app.get('/adminemaillist', function(req, res){
//    res.render('adminemail');
//});

app.get('/rest/emails', emails.findAll);
app.get('/rest/emails/:id', emails.findById);
app.post('/rest/emails', emails.addEmail);
app.put('/rest/emails/:id', emails.updateEmail);
app.delete('/rest/emails/:id', emails.deleteEmail);


app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});






// Have the server start listening on port 3000.
app.listen(3000);
console.log('Listening on port 3000, good');