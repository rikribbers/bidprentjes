var express = require("express");
var app = express();
var apirequest = require('request');
var math = require('mathjs');
var util = require('util')
var accents = require('remove-accents')
var moment = require('moment')
// Integration
app.set('view engine', 'pug');

// pools will use environment variables
// for connection information

const { Pool, Client } = require('pg')

const pool = new Pool({
    max: 75,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    Client: Client
});

var server = app.listen(8080, function () {
    console.log("Listening on port %s...", server.address().port);
    setTimeout(init_search, 5000)
});

function init_search() {
    console.log('initializing search....')
    internalquery('SELECT count(*) FROM bidprentjes b WHERE NOT EXISTS (SELECT 1 FROM search s WHERE s.id=b.id)', [],
        function (result) {
            //console.log(util.inspect(result, {showHidden: false, depth: null}))
            console.log('notMigratedCount=' + result.rows[0].count)
            count = result.rows[0].count
            limit = 1000
            while (count > 0) {
                if (count < limit) {
                    limit = count
                }

                internalquery('SELECT * FROM bidprentjes b WHERE NOT EXISTS (SELECT 1 FROM search s WHERE s.id=b.id) ORDER BY b.id OFFSET $1 LIMIT $2', [count - limit, limit], (result) => {
                    //console.log(util.inspect(result, {showHidden: false, depth: null}))

                    for (i = 0; i < result.rowCount; i++) {
                        item = result.rows[i]
                        // order is important here
                        var strippedInput = ''
                        if (item.voornaam != null) {
                            strippedInput += item.voornaam
                        }
                        if (item.voorvoegsel != null) {
                            strippedInput += item.voorvoegsel
                        }
                        if (item.achternaam != null) {
                            strippedInput += item.achternaam
                        }
                        if (item.geboorteplaats != null) {
                            strippedInput += item.geboorteplaats
                        }
                        if (item.rustplaats != null) {
                            strippedInput += item.rustplaats
                        }
                        if (item.geboren != null) {
                            strippedInput += moment(item.geboren).format('DDMMYYYY')
                        }
                        if (item.overleden != null) {
                            strippedInput += moment(item.overleden).format('DDMMYYYY')
                        }
                        internalquery('INSERT INTO search (id,value) VALUES ($1,$2)', [item.id, stripInput(strippedInput)], (result) => { return })
                    }
                })
                count = count - limit
            }
        })
}

function internalquery(query, parameters, callback) {
    pool.query(query, parameters, (err, sqlres) => {
        if (err) {
            console.log(err.stack)
        }
        else {
            callback(sqlres)
        }
    })
}

function query(res, query, parameters) {
    pool.query(query, parameters, (err, sqlres) => {
        if (err) {
            console.log(err.stack)
            res.send([])
        }
        else {
            res.send(sqlres.rows)
        }
    })
}

function query2(res, whereclause, parameters, page, orderby) {
    // first count
    countquery = "SELECT COUNT(*) FROM bidprentjes WHERE " + whereclause

    pool.query(countquery, parameters, (err, sqlres) => {
        if (err) {
            console.log(err.stack)
            res.send([])
        }
        else {
            total = sqlres.rows[0].count
            limit = 10
            // pages start at 1
            console.log(page)
            if (page < 1) page = 1

            // off set is limit (page-1) 
            offset = (page - 1) * limit

            // show last page offset
            if (offset > total) offset = total - math.mod(total, limit)

            query = "SELECT * FROM bidprentjes WHERE " + whereclause + " ORDER BY " + orderby + " ASC LIMIT " + limit + " OFFSET " + offset
            
            pool.query(query, parameters, (err, sqlres) => {
                if (err) {
                    console.log(err.stack)
                    res.send([])
                }
                else {
                    res.send(sqlres.rows)
                }
            })
        }
    })
}

function stripInput(input) {
    //console.log('stripInput=' + input)
    // remove accents and to lower case
    result = accents.remove(input).toLowerCase().replace(/[+]/g,'*')
    // reqex only lowecase characters numbers 
    // and the '*' character', remove the rest
    result = result.replace(/[^a-z\*1-9]/g, '')
    //console.log('strippedInput=' + result)
    return result
}

app.get('/api/v1/geboren/:date', function (req, res) {
    query(res, 'SELECT * FROM bidprentjes WHERE geboren=$1::timestamp', [req.params.date])
})

app.get('/api/v1/overleden/:date', function (req, res) {
    query(res, 'SELECT * FROM bidprentjes WHERE overleden=$1::timestamp', [req.params.date])
})

app.get('/api/v1/geboorteplaats/:plaatsnaam', function (req, res) {
    query(res, 'SELECT * FROM bidprentjes WHERE lower(geboorteplaats)=lower($1)::text', [req.params.plaatsnaam])
})

app.get('/api/v1/achternaam/:naam', function (req, res) {
    query(res, 'SELECT * FROM bidprentjes WHERE lower(achternaam)=lower($1)::text', [req.params.naam])
})

app.get('/api/v2/achternaam/:naam/:page', function (req, res) {
    query2(res, 'lower(achternaam)=lower($1)::text', [req.params.naam], req.params.page, 'achternaam')
})

app.get('/api/v2/search/:query', function (req, res) {
    q = '+' + stripInput(req.params.query) + '+'
    // replace wildcard * for %
            
    q = q.replace(/[+]/g,'%')
    q = q.replace(/[\*]/g,'%')
    console.log(q)
    query(res, 'SELECT b.* FROM bidprentjes b,search s WHERE s.value like($1)::text AND s.id=b.id LIMIT 100', [q])
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

app.get('/view/search/:query', function (req, res) {
    apirequest.get('http://localhost:8080/api/v2/search/' + req.params.query, function (error, response, body) {
        if (error) {
            throw error;
        }
        const data = JSON.parse(body);
        res.render('results', { title: 'Resultaten', rows: data, moment: require('moment') })
    });
})