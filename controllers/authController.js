const jwt = require('jsonwebtoken');
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

exports.login = (req, res) => {
    res.render('login', { title: 'Espace membre'});
};

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

exports.postLogin = (req, res) => {
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
};

exports.getMemberOnly = (req, res) => {
    console.log('req.user', req.user);
    if(req.user.role === 'moderator') {
        res.send(req.user);
    };
};