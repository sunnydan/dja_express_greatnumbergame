var express = require("express");
var app = express();

var session = require("express-session");
app.use(session({secret: "yamakemykokorogodokidokidonchaknow"}));

var path = require("path");
app.use(express.static(path.resolve(__dirname, "static")));
app.set('views', path.resolve(__dirname, "views"));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

context = {};

app.get('/', function(request, response) {
    if(!request.session.number) {
        request.session.number = Math.floor(Math.random()*101);
        request.session.status = "start";
    } 
    context = {};
    context['number'] = request.session.number;
    context['status'] = request.session.status;
    response.render("index", context);
});

app.post('/process', function(request, response) {
    if(request.session.number) {
        if(request.body.guess < request.session.number) {
            request.session.status = "toolow";
        }
        else if(request.body.guess > request.session.number) {
            request.session.status = "toohigh";
        }
        else {
            request.session.status = "correct";
        }
    }
    response.redirect('/');
});

app.get('/reset', function(request, response) {
    request.session.number = undefined;
    response.redirect('/');
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});