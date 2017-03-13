const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World with npm custom scripts');
});

app.get('/movies', (req, res) => {
    res.send('Bientôt des <b>films</b> ici même.');
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