const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://an:an752001@mycluster.9undu.mongodb.net/test';

const hbs = require('hbs');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/index', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/doLogin', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db("Cellphone");
    let results = await dbo.collection("user").
        find({ username: username, password: password }).toArray();

    if (results.length > 0) {
        res.redirect('/index');
    }
    else {
        res.render('login', { error: "*Wrong username or password" });
    }
});

app.get('/doLogout', (req, res) => {
    res.redirect('/login');
})

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/doAdd', async (req, res) => {
    let phoneName = req.body.phoneName;
    let phoneRam = req.body.phoneRam;
    let phoneRom = req.body.phoneRom;
    let phoneCPU = req.body.phoneCPU;
    let price = req.body.price;
    let producerName = req.body.producerName;

    let newCellphone = {
        phoneName: phoneName,
        phoneRam: phoneRam,
        phoneRom: phoneRom,
        phoneCPU: phoneCPU,
        price: price,
        producerName: producerName
    }
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    await dbo.collection('cellphone').insertOne(newCellphone);
    res.redirect('/add');
});

app.get('/manage', async (req, res) => {
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    let results = await dbo.collection('cellphone').find().toArray();
    res.render('manage', { model: results });
})

app.get('/edit', async (req, res) => {
    //id string from url
    let id = req.query.id;
    //convert id from url to MongoDB id
    let ObjectID = require('mongodb').ObjectID(id);
    //condition to delete
    let condition = { '_id': ObjectID };
    //get the product by id
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    let product = await dbo.collection('cellphone').findOne(condition);
    res.render('edit', { model: product })
})

app.post('/doEdit', async (req, res) => {
    let phoneName = req.body.phoneName;
    let phoneRam = req.body.phoneRam;
    let phoneRom = req.body.phoneRom;
    let phoneCPU = req.body.phoneCPU;
    let price = req.body.price;
    let producerName = req.body.producerName;

    let newCellphone = {
        $set: {
            phoneName: phoneName,
            phoneRam: phoneRam,
            phoneRom: phoneRom,
            phoneCPU: phoneCPU,
            price: price,
            producerName: producerName
        }
    };

    var ObjectID = require('mongodb').ObjectID;
    let condition = { '_id': ObjectID(id) }

    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    await dbo.collection('cellphone').updateOne(condition, newCellphone);
    res.redirect('/manage')
})

app.post('/doSearch', async (req, res) => {
    let phoneSearch = req.body.search;
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    let results = await dbo.collection('cellphone').find({ phoneName: new RegExp(phoneSearch, 'i') }).toArray();
    res.render('manage', { model: results });
})

app.get('/delete', async (req, res) => {
    //id string from url
    let id = req.query.id;
    //convert id from url to MongoDB id
    let ObjectID = require('mongodb').ObjectID(id);
    //condition to delete
    let condition = { '_id': ObjectID };
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db('Cellphone');
    await dbo.collection('cellphone').deleteOne(condition);
    res.redirect('/manage');
})  

var PORT = process.env.Port || 8000
app.listen(PORT);
console.debug("Server is running on port: " + PORT);