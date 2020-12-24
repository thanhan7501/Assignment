const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const hbs = require('hbs');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


app.get('/', async (req, res) => {
    res.render('index');
})

var PORT = process.env.Port || 8000
app.listen(PORT);
console.debug("Server is running on port: " + PORT);