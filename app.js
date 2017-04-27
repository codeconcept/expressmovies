const express = require('express');
const app = express();
var favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const path = require('path');
const config = require('./config');

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

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
});
const Movie = mongoose.model('Movie', movieSchema);

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
app.use(expressJwt({ secret: secret})
    .unless({ path: ['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search', '/login', new RegExp('/movie-details.*/', 'i')]}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {

    const title = "Films français des 30 dernières années";
    frenchMovies = [];
    Movie.find((err, movies) => {
        if(err) {
            console.log('could not retrieve movies from DB');
            res.sendStatus(500);
        } else {
            frenchMovies = movies;
            res.render('movies', { title: title, movies: frenchMovies});
        }
    });
});

//!\ In upload.fields([]), the empty array '[]' is required
app.post('/movies', upload.fields([]), (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body; 
        console.log('form data: ', formData);
        
        const title = req.body.movietitle;
        const year = req.body.movieyear;
        const myMovie = new Movie({ movietitle: title, movieyear: year });

        myMovie.save((err, savedMovie) => {
            if(err) {
                console.error(err);
                return;
            } else {
                console.log(savedMovie);
            }
        });
        
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

app.post('/movie-details/:id',  urlencodedParser,  (req, res) => {
    console.log('movietitle: ', req.body.movietitle, 'movieyear: ', req.body.movieyear);
    if (!req.body) {
        return res.sendStatus(500);
    }
    const id = req.params.id;
    Movie.findByIdAndUpdate(id, { $set : {movietitle: req.body.movietitle, movieyear: req.body.movieyear}}, 
                                { new: true }, (err, movie) => {
        if(err) {
            console.error(err);
            return res.send('le film n\'a pas pu être mis à jour');
        }
        res.redirect('/movies');
    });
});

app.get('/movie-details/:id', (req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        console.log('movie-details', movie);
        res.render('movie-details.ejs', { movie: movie});
    })
});

app.delete('/movie-details/:id', (req, res) => {
    console.log('delete');
    const id = req.params.id;
    Movie.findOneAndRemove(id, (err, movie) => {
        console.log(movie);
        res.sendStatus(202);
    });
})

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