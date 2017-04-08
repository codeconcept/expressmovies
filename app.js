const express = require('express');
const app = express();
var favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const path = require('path');

const jwt = require('jsonwebtoken');
// to verify token on the request header
const expressJwt = require('express-jwt'); 

const faker = require('faker');
faker.locale = "fr";

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://your_user:your_password@ds145780.mlab.com:45780/expressmovie');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect to my DB'));
db.once('open', function() {
  console.log('connected to the DB :) ')
});

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
});


const Movie = mongoose.model('Movie', movieSchema);
const title = faker.lorem.sentence(3);
const year = Math.floor(Math.random() * 80 ) + 1950;
const myMovie = new Movie({ movietitle: title, movieyear: year });

myMovie.save((err, savedMovie) => {
    if(err) {
        console.error(err);
        return;
    } else {
        console.log(savedMovie);
    }
});


const port = 3000;
let frenchMovies = [];

app.set('views', './views');
app.set('view engine', 'ejs');

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

// to service static files from the public folder
app.use('/public', express.static('public'));

// // favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// check token on all pages except the ones mentioned in unless()
app.use(expressJwt({ secret: secret}).unless({ path: ['/', '/movies', '/movie-search', '/login']}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {

    const title = "Films français des 30 dernières années";
    frenchMovies = [
        { title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
        { title: 'Buffet froid', year: 1979},
        { title: 'Le diner de cons', year: 1998},
        { title: 'de rouille et d\'os', year: 2012}
    ]
    res.render('movies', { title: title, movies: frenchMovies});
});

//!\ In upload.fields([]), the empty array '[]' is required
app.post('/movies', upload.fields([]), (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body; 
        console.log('form data: ', formData);
        const newMovie = { title: formData.movietitle, year: formData.movieyear };
        frenchMovies = [... frenchMovies, newMovie];
        res.sendStatus(201);
    } 
});


// create application/x-www-form-urlencoded parser
// https://github.com/expressjs/body-parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies-old-browser', urlencodedParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {    
        frenchMovies = [... frenchMovies, { title: req.body.movietitle, year: req.body.movieyear }];
        res.sendStatus(201);
    } 
});


app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details');
});

app.get('/movie-search', (req, res) => {
    res.render('movie-search');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Espace membre'});
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body);
    if (!req.body) {
        return res.sendStatus(500);
    } else {        
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            // iss means 'issuer'
            const myToken = jwt.sign({iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator'}, secret);
            console.log('myToken', myToken);
            res.json(myToken);
        } else {
            res.sendStatus(401);
        } 
    } 
});

app.get('/member-only',(req, res) => {
    console.log('req.user', req.user);
    if(req.user.role === 'moderator') {
        res.send(req.user);
    };
});

// // to make the error message clearer
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send(err.inner);
//   }
// });


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});