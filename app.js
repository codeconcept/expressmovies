const express = require('express');
const app = express();
var favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const path = require('path');
const config = require('./config');
const movieController = require('./controllers/movieController');
const authController = require('./controllers/authController');

const jwt = require('jsonwebtoken');
// to verify token on the request header
const expressJwt = require('express-jwt'); 

const faker = require('faker');
faker.locale = "fr";

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@ds145780.mlab.com:45780/expressmovie`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'));
db.once('open', function() {
  console.log('connected to the DB :) ')
});

const port = 3000;
let frenchMovies = [];

app.set('views', './views');
app.set('view engine', 'ejs');

// to service static files from the public folder
app.use('/public', express.static('public'));

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

// check token on all pages except the ones mentioned in unless()
app.use(expressJwt({ secret: secret})
    .unless({ path: ['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search', '/login', new RegExp('/movie-details.*/', 'i')]}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', movieController.getMovies);

//!\ In upload.fields([]), the empty array '[]' is required
app.post('/movies', upload.fields([]), movieController.postMovie);

// create application/x-www-form-urlencoded parser
// https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies-old-browser', urlencodedParser, movieController.getMoviesOldBrowsers);

app.get('/movies/add', movieController.getMoviesAdd);

app.get('/movies/:id', movieController.getMovieById);

app.post('/movie-details/:id',  urlencodedParser, movieController.postMovieDetails);

app.get('/movie-details/:id', movieController.getMovieDetails);

app.delete('/movie-details/:id', movieController.deleteMovie)

app.get('/movie-search', movieController.movieSearch);

app.get('/login', authController.login);

app.post('/login', urlencodedParser, authController.postLogin);

app.get('/member-only', authController.getMemberOnly);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});