var express = require("express");
var app = express();
var apirequest = require('request');
// Integration
app.set('view engine', 'pug');

// pools will use environment variables
// for connection information
const { Pool, Client } = require('pg')

var server = app.listen(8080, function () {
    console.log("Listening on port %s...", server.address().port);
});

function query(res,query,parameters) {
    const client = new Client()
    
    client.connect()
    
    client.query(query, parameters, (err, sqlres) => {
      if (err) {
        console.log(err.stack)
        res.send([])
      }
      else { 
        res.send(sqlres.rows)
      }
      client.end()
    })  
}

app.get('/api/v1/geboren/:date', function (req, res) {
    query(res,'SELECT * FROM bidprentjes WHERE geboren=$1::timestamp',[req.params.date])
})

app.get('/api/v1/overleden/:date', function (req, res) {
    query(res,'SELECT * FROM bidprentjes WHERE overleden=$1::timestamp',[req.params.date])
})

app.get('/api/v1/geboorteplaats/:plaatsnaam', function (req, res) {
    query(res,'SELECT * FROM bidprentjes WHERE lower(geboorteplaats)=lower($1)::text',[req.params.plaatsnaam])
})

app.get('/api/v1/achternaam/:naam', function (req, res) {
    query(res,'SELECT * FROM bidprentjes WHERE lower(achternaam)=lower($1)::text',[req.params.naam])
})

app.get('/view/geboren/:date', function (req, res) {

    var date = req.params.date;

    apirequest.get('http://localhost:8080/api/v1/geboren/' + date, function (error, response, body) {
        if (error) {
            throw error
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data, moment: require('moment') })
    });
})

app.get('/view/overleden/:date', function (req, res) {

    var date = req.params.date;

    apirequest.get('http://localhost:8080/api/v1/overleden/' + date, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data, moment: require('moment') })
    });
})

app.get('/view/geboorteplaats/:plaatsnaam', function (req, res) {

    var name = req.params.plaatsnaam;

    apirequest.get('http://localhost:8080/api/v1/geboorteplaats/' + name, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data, moment: require('moment') })
    });
})

app.get('/view/achternaam/:naam', function (req, res) {

    var name = req.params.naam;

    apirequest.get('http://localhost:8080/api/v1/achternaam/' + name, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data, moment: require('moment') })
    });
})