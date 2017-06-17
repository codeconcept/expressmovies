const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number
});

module.exports = mongoose.model('Movie', movieSchema);