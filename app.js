var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');

var dbConfig = require('./db.js');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to Database');
});

require('./models/category');
require('./models/gameEnd');
require('./models/user');



var app = express();

// mongoose setup
mongoose.connect(dbConfig.url);

// create a persisent session store re-using our mongoose connection
// It creates/uses a collection called "sessions" by default
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

const Cat = require('./models/catModel')(mongoose);
const Quest = require('./models/questModel')(mongoose);

/*Definitions, Famous People, Acronyms, Movie Headlines, and Ludicrous Laws*/
///////////////////////////////////////////////////////////////////////////////////*START LOAD MONGO DATA*/
Cat.findOne({categoryName: "definitions"}, function(d1,d2) {
  if(!d2)
  {
    var acat = new Cat;
    acat.categoryName = "definitions";
    acat.save();
  }
})

Quest.findOne({categoryName: "definitions"},{question: "what is the definition of abaya?"},{answer: "full length sleeveless outer garment worn by arabs"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "definitions";
    q.question = "what is the definition of abaya?";
    q.answer = "full length sleeveless outer garment worn by arabs";
    q.save();
  }
})

Quest.findOne({categoryName: "definitions"},{question: "what is the definition of badmash?"},{answer: "an indian hooligan"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "definitions";
    q.question = "what is the definition of badmash?";
    q.answer = "an indian hooligan";
    q.save();
  }
})

Quest.findOne({categoryName: "definitions"},{question: "what is the definition of deasil?"},{answer: "clockwise or in the direction of the sun's course"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "definitions";
    q.question = "what is the definition of deasil?";
    q.answer = "clockwise or in the direction of the sun's course";
    q.save();
  }
})

Cat.findOne({categoryName: "famous people"}, function(d1,d2) {
  if(!d2)
  {
    var acat = new Cat;
    acat.categoryName = "famous people";
    acat.save();
  }
})

Quest.findOne({categoryName: "famous people"},{question: "who is mary anning?"},{answer: "a fossil collector"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "famous people";
    q.question = "who is mary anning?";
    q.answer = "a fossil collector";
    q.save();
  }
})

Quest.findOne({categoryName: "famous people"},{question: "who is anton drexler?"},{answer: "he created the nazi party"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "famous people";
    q.question = "who is anton drexler?";
    q.answer = "he created the nazi party";
    q.save();
  }
})

Quest.findOne({categoryName: "famous people"},{question: "who is baldwin iv?"},{answer: "king of jerusalem"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "famous people";
    q.question = "who is baldwin iv?";
    q.answer = "king of jerusalem";
    q.save();
  }
})

Cat.findOne({categoryName: "acronyms"}, function(d1,d2) {
  if(!d2)
  {
    var acat = new Cat;
    acat.categoryName = "acronyms";
    acat.save();
  }
})

Quest.findOne({categoryName: "acronyms"}, {question: "what is the acronym laser?"},{answer: "light amplification by stimulated emission of radiation"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "acronyms";
    q.question = "what is the acronym laser?";
    q.answer = "light amplification by stimulated emission of radiation";
    q.save();
  }
})

Quest.findOne({categoryName: "acronyms"},{question: "what is the acronym taser?"},{answer: "thomas a. swift’s electric rifle"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "acronyms";
    q.question = "what is the acronym taser?";
    q.answer = "thomas a. swift’s electric rifle";
    q.save();
  }
})

Quest.findOne({categoryName: "acronyms"},{question:"what is the acronym zip in zip code?"},{answer: "zone improvement plan"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "acronyms";
    q.question = "what is the acronym zip in zip code?";
    q.answer = "zone improvement plan";
    q.save();
  }
})

Cat.findOne({categoryName: "movie taglines"}, function(d1,d2) {
  if(!d2)
  {
    var acat = new Cat;
    acat.categoryName = "movie taglines";
    acat.save();
  }
})

Quest.findOne({categoryName: "movie taglines"},{question: "what movie had the tagline just because they serve you doesn't mean they like you?"},{answer: "clerks"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "movie taglines";
    q.question = "what movie had the tagline just because they serve you doesn't mean they like you?";
    q.answer = "clerks";
    q.save();
  }
})

Quest.findOne({categoryName: "movie taglines"},{question: "what movie had the tagline his story will touch you, even though he can't"},{answer: "edward scissorhands"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "movie taglines";
    q.question = "what movie had the tagline his story will touch you, even though he can't";
    q.answer = "edward scissorhands";
    q.save();
  }
})

Quest.findOne({categoryName: "movie taglines"},{question: "what movie has the tagline see our family and feel better about yours?"},{answer: "the simpsons movie"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "movie taglines";
    q.question = "what movie has the tagline see our family and feel better about yours?";
    q.answer = "the simpsons movie";
    q.save();
  }
})

Cat.findOne({categoryName: "ludicrous laws"}, function(d1,d2) {
  if(!d2)
  {
    var acat = new Cat;
    acat.categoryName = "ludicrous laws";
    acat.save();
  }
})

Quest.findOne({categoryName: "ludicrous laws"},{question: "what country is it against the law to name a pig napoleon?"},{answer: "france"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "ludicrous laws";
    q.question = "what country is it against the law to name a pig napoleon?";
    q.answer = "france";
    q.save();
  }
})

Quest.findOne({categoryName: "ludicrous laws"},{question: "what city is it against state law to get a fish drunk?"},{answer: "ohio"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "ludicrous laws";
    q.question = "what city is it against state law to get a fish drunk?";
    q.answer = "ohio";
    q.save();
  }
})

Quest.findOne({categoryName: "ludicrous laws"},{question: "what state must women obtain written permission from their husbands to wear false teeth?"},{answer: "vermont"}, function(d1,d2) {
  if(!d2)
  {
    var q = new Quest;
    q.categoryName = "ludicrous laws";
    q.question = "what state must women obtain written permission from their husbands to wear false teeth?";
    q.answer = "vermont";
    q.save();
  }
})
///////////////////////////////////////////////////////////////////////////////////*END OF LOAD MONGO DATA*/

var index = require('./routes/index');
var users = require('./routes/users');
var game = require('./routes/game');
var select = require('./routes/select');
var create = require('./routes/create')(Cat, Quest);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session
// needed by Express Messages and Passport
app.use(session({
  secret: 'secret',
  resave: false,
  store: sessionStore,
  saveUninitialized: true
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

// Express Flash Messages with pug
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/', game);
app.use('/', select);
app.use('/', create);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('HERE IS THE 404 ERROR LINE 101 app.js');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.sessionStore = sessionStore;
module.exports.Cat = Cat;
module.exports.Quest = Quest;

