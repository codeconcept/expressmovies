const express = require('express');
const app = express();

const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {
    res.render('movies');
});

app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.send(`film numéro ${id}.`);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});