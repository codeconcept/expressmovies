const express = require('express');
const app = express();

const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

// to service static files from the public folder
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {
    res.render('movies', { joke: 'la blague du jour'});
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