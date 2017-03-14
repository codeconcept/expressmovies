const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');


// to service static files from the public folder
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {

    const title = "Films français des 30 dernières années";
    const frenchMovies = [
        { title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
        { title: 'Buffet froid', year: 1979},
        { title: 'Le diner de cons', year: 1998},
        { title: 'de rouille et d\'os', year: 2012}
    ]
    res.render('movies', { title: title, movies: frenchMovies});
});

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies', urlencodedParser, (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    } else {
        // res.send('welcome, ' + req.body.movietitle);
        console.log('req.body', req.body);
        res.send(req.body.movietitle);
    } 
});


app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});